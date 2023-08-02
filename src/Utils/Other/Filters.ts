
// <--------------------------------- filtar por user fixado --------------------------------->
export function FilterFixed(users) {
  const usersFilter = [...users].sort(function (x, y) {
    let a = x.fixed;
    let b = y.fixed;
    return a == b ? 0 : a < b ? 1 : -1;
  });
  return usersFilter
}

// <--------------------------------- Filtrar pot alfabeto  --------------------------------->
interface props {
  data: any
  action: 'desc' | 'asc'
}

export function FilterAlphabetical({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.name.toUpperCase();
    let b = y.name.toUpperCase();
    if (action === 'asc') {
      return a == b ? 0 : a < b ? 1 : -1;
    } else {
      return a == b ? 0 : a > b ? 1 : -1;
    }
  });
  return data
}

export function FilterNumberPendenciesOfUser({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.pendencies
    let b = y.pendencies
    if (action === 'asc') {
      return a - b
    } else {
      return b - a
    }
  });
  return data
}

export function FilterSizeFiles({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.size
    let b = y.size
    if (action === 'asc') {
      return a - b
    } else {
      return b - a
    }
  });
  return data
}

export function FilterStatus({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.viewedDate;
    let b = y.viewedDate;

    if (action === 'asc') {
      return a - b
    } else {
      return b - a
    }
  });
  console.log(data)
  return data
}

export function FilterDate({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.created_date
    let b = y.created_date
    if (action === 'asc') {
      return a - b
    } else {
      return b - a
    }
  });

  return data
}

export function FilterSize({ data, action }: props) {
  data.sort(function (x, y) {
    let a = x.size
    let b = y.size
    if (action === 'asc') {
      return a == b ? 0 : a < b ? 1 : -1
    } else {
      return a == b ? 0 : a > b ? 1 : -1
    }
  })
}

