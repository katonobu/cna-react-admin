import { fetchUtils, DataProvider} from 'ra-core';
import { CreateResult, DeleteResult, DeleteManyResult, GetListResult, GetManyReferenceResult, GetManyResult, GetOneResult, UpdateManyResult, UpdateResult } from 'react-admin';
//interface RecordType extends RaRecord = any;

export const tbDataProvider = (apiUrl:string, httpClient = fetchUtils.fetchJson): DataProvider =>{
    return {
        create:() => Promise.resolve({ data: null} as CreateResult), // avoids adding a context in tests
        delete: () => Promise.resolve({ data: null} as DeleteResult), // avoids adding a context in tests
        deleteMany: () => Promise.resolve({ data: [] } as DeleteManyResult), // avoids adding a context in tests
        getList: () => Promise.resolve({ data: [], total: 0 } as GetListResult), // avoids adding a context in tests
        getMany: () => Promise.resolve({ data: []} as GetManyResult), // avoids adding a context in tests
        getManyReference: () => Promise.resolve({ data: [], total: 0 } as GetManyReferenceResult), // avoids adding a context in tests
        getOne: () => Promise.resolve({ data: null} as GetOneResult), // avoids adding a context in tests
        update: () => Promise.resolve({ data: null} as UpdateResult), // avoids adding a context in tests
        updateMany: () => Promise.resolve({ data: [] } as UpdateManyResult), // avoids adding a context in tests
    }
};