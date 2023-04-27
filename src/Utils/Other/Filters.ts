
  // <--------------------------------- filtar por user fixado --------------------------------->
  export function FilterFixed(users) {
    return users.sort(function (x, y) {
      let a = x.fixed;
      let b = y.fixed;
      return a == b ? 0 : a < b ? 1 : -1;
    });
  }

    // <--------------------------------- Filtrar pot alfabeto  --------------------------------->
  export function FilterAlphabetical({dataFilter, filter, setReturn}) {
    var dataToFilter =  [...dataFilter];
    dataToFilter.sort(function (x, y) {
      let a = x.name.toUpperCase();
      let b = y.name.toUpperCase();
      if (filter.name) {
        return a == b ? 0 : a < b ? 1 : -1;
      } else {
        return a == b ? 0 : a > b ? 1 : -1;
      }
    });
    setReturn(FilterFixed(dataToFilter));
  }

  export function FilterStatus({dataFilter, filter, setReturn}) {
    var dataToFilter = [...dataFilter];
    dataToFilter.sort(function (x, y) {
      let a = x.status;
      let b = y.status;
      if(x.status === undefined){
        a = x.viwed
        b= y.viwed
      }

      if (filter.status) {
        return a == b ? 0 : a < b ? 1 : -1;
      } else {
        return a == b ? 0 : a > b ? 1 : -1;
      }
    });
    setReturn(FilterFixed(dataToFilter));
  }

  export function FilterDate({dataFilter, filter, setReturn}) {
    var dataToFilter = [...dataFilter];
    dataToFilter.sort((a, b) => {
      a.date = new Date(a.created_date);
      b.date = new Date(b.created_date);
      if (filter.date) {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });
    setReturn(FilterFixed(dataToFilter));
  }

  export function FilterSize({dataFilter, filter, setReturn}){
    var files = [...dataFilter]
    files.sort(function (x, y){
      let a = x.size
      let b = y.size
      if(filter.size){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setReturn(files)
  }