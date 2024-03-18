
export type GroupedList = { [key: string]: any[] }

export const groupListbyKey = (list: any[], key: string): GroupedList => {
    return list.reduce((x, y) => {
      if (x[y[key]]) x[y[key]].push(y)
      else x[y[key]] = [y]
      return x;
    }, {} as any)
  }


  export const groupedListToList = (grouped: GroupedList): any[] => {
    return Object.keys(grouped).map(groupKey => grouped[groupKey])
  }