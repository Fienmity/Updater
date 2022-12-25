export async function filter_item(array: any[], callback: CallableFunction): Promise<any[]> {
    let new_array = []
    for (let i = 0; i < array.length; i++) {
        if (await callback(array[i], i, array)) new_array.push(array[i]);
    }
    return new_array
}

export async function for_item(array: any[], callback: any): Promise<void> {
    for(let i = 0; i < array.length; i++) {
        await callback(array[i], i, array)
    }
}

export async function map_item(array: any[], callback: any): Promise<any[]> {
    let new_array = []
    for(let i = 0; i < array.length; i++) {
        new_array.push(await callback(array[i], i, array));
    }
    return new_array
}