function FormatSizeFile(size:number) {
    if(size < 1024){
        return `${size}B`
    } else if(size < 1048576){
        const sizeHere = size / 1024
        return `${sizeHere.toFixed(1)}KB`
    } else if(size < 1073741824){
        const sizeHere = size / 1048576
        return `${sizeHere.toFixed(1)}MB` 
    } else if(size < 1073741824){
        const sizeHere = size / 1073741824
        return `${sizeHere.toFixed(1)}GB` 
    }
}

export default FormatSizeFile