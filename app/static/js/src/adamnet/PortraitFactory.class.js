import queries from '../../config/queries.js'
import apiConfig from '../../config/js-api-connect.js';
import Api from '../../lib/js-api-connect/Api.class.js';
import Portrait from './Portrait.class.js'

export default class PortraitFactory {
    constructor() {
        if(this.isPortraitsIndexed()) {
            this.portraits = JSON.parse(localStorage.getItem('ADRmeta_portraits'));
        } else {
            this.portraits = [];
        }
        this.api = new Api(apiConfig);
    }

    addPortrait(portrait) {
        this.portraits.push(portrait);
    }

    savePortraitsToLocalStorage() {
        localStorage.setItem('ADRmeta_portraits_isIndexed', true);
        localStorage.setItem('ADRmeta_portraits', JSON.stringify(this.portraits));
    }

    getPortraitsFromCollection(name) {
        return this.portraits.filter(portrait => portrait.name === name);
    }

    isPortraitsIndexed() {
        return localStorage.getItem('ADRmeta_portraits_isIndexed');
    }

    indexPortrait(record) {
        const self = this;
        const endpoints = self.api.getEndpointsForApi('azureFaceAPI');
        endpoints.largeFaceList.addFace.body.url = record.img.value;
        endpoints.largeFaceList.addFace.body.userData = record.cho.value;

        self.api.request('azureFaceAPI', endpoints.largeFaceList.addFace).then(function(data) {

               let portrait = new Portrait(
                   data.persistedFaceId,
                   record.cho.value,
                   record.type.value,
                   record.title.value,
                   record.description.value,
                   record.beginTime.value,
                   record.img.value
               );
               self.addPortrait(portrait);

        }).catch(function(err){
           console.log(err);
        });
    }

    isPortraitInCollection(name) {
        return this.getPortraitFromCollection(name).length > 0;
    }
    getPortraits(name) {
        const self = this;
        return new Promise(function(resolve, reject) {
            const endpoints = self.api.getEndpointsForApi('adamnet');
            endpoints.sparql.GET.params.query = encodeURI(queries.sparql.getPortraits);


            self.api.request('adamnet', endpoints.sparql.GET).then(function(data) {
                console.log(data);
                resolve(data);
            }).catch(function(err){
                reject(err);
            });
        });
    }

}
