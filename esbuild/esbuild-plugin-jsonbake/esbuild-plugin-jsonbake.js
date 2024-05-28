import fs from 'node:fs';
import {
    parseString,
    getFileExtension,
    getFolder,
    checkFile,
    isDirectory
} from './utils.js';
import { RESULTTYPE, defaultIncludeFiles } from './config.js';

// options:
/**
const options = {
    parsePattern: `/\{\{\s*([\/\.\-\w]*)\s*\}\}/`,
    stripComments: false,
    indentation: `"/t"`,
    includeFiles: {
        json: { resultType: "json"},
        html: { resultType: "string", separator: ""  },
        csv: { resultType: "string", separator: ";"  }
    }, 
    variables: `"{}"`,
    variableRegex: `/@(\w+)@/g`,
}
*/

/**
    files
    options: {
        parsePattern: `/\{\{\s*([\/\.\-\w]*)\s*\}\}/`,
        stripComments: false,
        indentation: `"/t"`,
        includeFiles: {
        json: { resultType: "json"},
        html: { resultType: "string", separator: ""  },
        csv: { resultType: "string", separator: ";"  }
        }, 
        variables: `"{}"`,
        variableRegex: `/@(\w+)@/g`,
    },

    // multiple files in a key value pair
    // the key is the destination and
    // the value is the root of that entry point
    files: {
        "dist/final.json": "app/base.json"
    }
 * 
*/

const jsonbakePlugin = (opts) => ({
    name: 'jasonbake',
    setup(build) {
        const { files } = opts;

        const options = {
            stripComments: false,
            indentation: "\t",
            parsePattern: /\{\{\s*([\/\.\-\w]*)\s*\}\}/,
            variables: {},
            variableRegex: /@(\w+)@/g,
            ...opts
        };

        build.onLoad({ filter: /\.(json)$/ }, async (args) => {
            // Merge user options with default options, without defaultIncludeFiles
            if (args.path.includes('partials')) {
                return;
            }

            // Merge user and default includeFiles
            // won't be needed in Grunt 0.5.0: https://github.com/gruntjs/grunt/issues/738

            if ( ! options.includeFiles ) {
                options.includeFiles = defaultIncludeFiles;

            } else {
                Object.keys( defaultIncludeFiles ).forEach( function( defaultFileExtension ) {
                    const optionsFileExtObj = options.includeFiles[ defaultFileExtension ];
                    if ( optionsFileExtObj ) {
                        const defFileExtObj = defaultIncludeFiles[ defaultFileExtension ];
                        Object.keys( defFileExtObj ).forEach( function( defaultFileExtensionObjectKey ) {
                            if ( ! optionsFileExtObj[ defaultFileExtensionObjectKey ] ) {
                                optionsFileExtObj[ defaultFileExtensionObjectKey ] = defaultIncludeFiles[ defaultFileExtension ][ defaultFileExtensionObjectKey ];
                            }
                        } );
                    } else {
                        options.includeFiles[ defaultFileExtension ] = defaultIncludeFiles[ defaultFileExtension ];
                    }
                } );
            }

            // Returns array of the file extensions of files that can be included
            function getIncludeFileExtensions() {
                return Object.keys( options.includeFiles );
            }

            // Returns true if the path given points at a JSON file or accepted include file
            function isIncludeFile( path ) {
                if ( fs.statSync( path ).isFile() &&
                    getIncludeFileExtensions().indexOf( getFileExtension( path ) ) !== - 1 ) return true;

                return false;
            }


            function parseFile( path ) {
                var fileExtension = getFileExtension( path );

                if ( fileExtension ) {

                    var extensionFound = false;
                    var parsedResult = null;

                    getIncludeFileExtensions().forEach( function( includeFileExt ) {
                        if ( ! extensionFound ) {

                            if ( fileExtension === includeFileExt ) {
                                extensionFound = true;

                                var content = fs.readFileSync( path );
                                var resultType = options.includeFiles[ includeFileExt ][ "resultType" ];

                                if ( resultType === RESULTTYPE.JSON ) {

                                    parsedResult = parseJSON( path, content );

                                } else if ( resultType === RESULTTYPE.STRING ) {

                                    var separator = options.includeFiles[ includeFileExt ][ "separator" ];
                                    parsedResult = parseString( content, separator );

                                }
                            }
                        }
                    } );

                    if ( ! extensionFound ) return undefined;
                    else return parsedResult;
                }

                return undefined;
            }

            // Parses a JSON file and returns value as object
            function parseJSON( path, content ) {

                return JSON.parse( content, function( key, value ) {

                    if ( options.stripComments && key === "{{comment}}" ) return undefined;

                    // Replace variables in their values
                    if ( Object.keys( options.variables ).length && typeof value === "string" ) {
                        value = replaceVariables( value );
                    }

                    const match = ( typeof value === "string" ) ? value.match( options.parsePattern ) : null;

                    if ( match ) {
                        const folderPath = getFolder( path ) || ".";
                        const fullPath = folderPath + "/" + match[ 1 ];

                        return isDirectory( fullPath ) ? parseDirectory( fullPath ) : parseFile( fullPath );
                    }

                    return value;

                } );
            }

            // Replaces defined variables in the given value
            function replaceVariables( value ) {

                return value.replace( options.variableRegex, function( match, key ) {

                    if ( ! options.variables[ key ] ) {
                        console.log( "No variable definition found for: " + key );
                        return "";
                    }

                    return options.variables[ key ];
                } );
            }

            // Parses a text file and returns value as object
            function parseString( content, separator ) {
                return content.replace( /"/g, "\"" ).replace( /\n/g, separator );
            }

            // Parses a directory and returns content as array
            function parseDirectory( path ) {
                return fs.readdirSync( path )
                    .map( function( file ) {
                        const filePath = path + "/" + file;
                        if ( isIncludeFile( filePath ) ) return parseFile( filePath );
                        else if ( isDirectory( filePath ) ) return parseDirectory( filePath );
                        return null;
                    })
                    .filter( function( value ) {
                        return value !== null;
                    });
            }

            // Loop over all files given in config and parse them
            files.forEach( function( file ) {

                const src = file.src;
                const dest = file.dest;

                if ( ! checkFile( src ) ) return;

                const destContent = JSON.stringify( parseFile( src ), null, options.indentation );

                fs.writeFile(dest, destContent, err => {
                    if (err) {
                        console.error('fs.writeFile err: ', err);
                    } else {
                        console.log(`${src} written to SRC folder`);
                    }
                });
            });
            
            return;
        });
    }
});

export { jsonbakePlugin };