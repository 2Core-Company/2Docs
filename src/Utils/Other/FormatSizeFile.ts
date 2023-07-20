function FormatSizeFile(size:number) {
    if(size < 1024){
        return [`${size}`, ' B']
    } else if(size < 1048576){
        return [`${(size / 1024).toFixed(1).replace('.', ',')}`, ' KB']
    } else if(size < 1073741824){
        return [`${(size / 1048576).toFixed(1).replace('.', ',')}`,' MB']
    } else if(size < 1073741824){
        return [`${(size / 1073741824).toFixed(1).replace('.', ',')}`,' GB']
    } else {
        return ['Não foi possível calcular o tamanho.', ''];
    }
}

export default FormatSizeFile