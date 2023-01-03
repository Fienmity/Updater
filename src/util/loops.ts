export async function filterItem(array: any[], callback: CallableFunction): Promise<any[]> {
    let newArray = []
    for (let i = 0; i < array.length; i++) {
        if (await callback(array[i], i, array)) newArray.push(array[i]);
    }
    return newArray
}

export async function forItem(array: any[], callback: any): Promise<void> {
    for(let i = 0; i < array.length; i++) {
        await callback(array[i], i, array)
    }
}

export async function mapItem(array: any[], callback: any): Promise<any[]> {
    let newArray = []
    for(let i = 0; i < array.length; i++) {
        newArray.push(await callback(array[i], i, array));
    }
    return newArray
}
