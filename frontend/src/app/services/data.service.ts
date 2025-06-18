import { Injectable } from '@angular/core';
import { Data } from '../models/data.model';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private storageKey = 'baseConhecimento';

    getAll(): Data[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveAll(docs: Data[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(docs));
    }

    add(doc: Data) {
        const docs = this.getAll();
        docs.push(doc);
        this.saveAll(docs);
    }

    update(index: number, updatedDoc: Data) {
        const docs = this.getAll();
        docs[index] = updatedDoc;
        this.saveAll(docs);
    }
}
