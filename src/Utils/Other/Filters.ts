
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
  interface props{
    data:any
    action: 'desc' | 'asc'
  }

  export function FilterAlphabetical({data, action}:props) {
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

  export function FilterNumberPendenciesOfUser({data, action}:props) {
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

