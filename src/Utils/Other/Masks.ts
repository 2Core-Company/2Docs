export function PhoneMask(value: string | undefined) {
  const cleaned = value?.replace(/\D/g, ''); // Remove todos os não dígitos

  const match = cleaned?.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);

  if (match) {
    let formattedValue = '';

    if (match[1]) {
      formattedValue += `(${match[1]}`;
    }

    if (match[2]) {
      formattedValue += `) ${match[2]}`;
    }

    if (match[3]) {
      formattedValue += `-${match[3]}`;
    }

    return formattedValue;
  }

  return value;
}

export function lineLandMask(value: string | undefined) {
  if (value) {
    // if (value.length > 9) {
    //   value = value.substring(value.length - 9)
    // }

    const cleaned = value.replace(/\D/g, ''); // Remove todos os não dígitos
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})$/);
    if (match) {
      let formattedValue = '';

      if (match[1]) {
        formattedValue += `${match[1]}`;
      }

      if (match[2]) {
        formattedValue += `-${match[2]}`;
      }

      return formattedValue;
    }
  }


  return value;
}