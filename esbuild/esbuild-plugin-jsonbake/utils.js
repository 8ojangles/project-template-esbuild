// Parses a text file and returns value as object
import fs from 'node:fs';

export function parseString( content, separator ) {
    return content.replace( /"/g, "\"" ).replace( /\n/g, separator );
}

// Returns the file extenstion or empty string if there is no extension
export function getFileExtension( path ) {
    if ( path.indexOf( "." ) > -1 ) {
        return path.split( "." ).pop();
    }
    return "";
}

export function getFolder( path ) {
    var segments = path.split( "/" );
    segments.pop();
    return segments.join( "/" );
}

// Returns true if source points to a file
export function checkFile( path ) {
    if ( typeof path === "undefined" || ! fs.existsSync( path ) ) {
        console.log( "Source file \"" + path + "\" not found." );
        return false;
    }
    return true;
}

// Returns true if the path points to a directory
export function isDirectory( path ) {
    return fs.statSync( path ).isDirectory();
}