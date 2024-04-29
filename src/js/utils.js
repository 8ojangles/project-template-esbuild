function aTestFunction(a, b) {
    if (!a || !b) {
        console.log('fN requires 2 numbers');
        return;
    }
    return a + b;
}

export { aTestFunction };