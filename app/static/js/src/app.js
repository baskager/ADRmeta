'use strict';
import mainConfig from '../config/main.js';
import apiConfig from '../config/js-api-connect.js';
import Api from '../lib/js-api-connect/Api.class.js';
import PortraitFactory from './adamnet/PortraitFactory.class.js'

/**
* Nifty little webapp that fetches paintings from the Rijksmuseum API
*
* @author  Bas Kager
* @version 1.0
* @since   7-02-2018
*/
(function () {

    const page = {
        portraitFactory: new PortraitFactory(),
        portraitOverview: function() {
            document.querySelector('#loader').style.display = 'block';
            document.querySelector('#main-section').innerHTML = '';

            let portraits = this.portraitFactory.portraits;

            let sectionTemplate = document.querySelector('#portraits-overview').innerHTML;
            let template = Handlebars.compile(sectionTemplate);

            let data = template({
                portraits: portraits
            });
            document.querySelector('#loader').style.display = 'none';
            document.querySelector('#main-section').innerHTML += data;

        },
        portraitDetail: function(azureFaceId) {
            let self = this;
            document.querySelector('#main-section').innerHTML = '';

            let portrait = this.portraitFactory.getPortraitFromCollection(azureFaceId)[0];
            // let similarPortraits = this.portraitFactory.getSimilarPortraits(azureFaceId);

            let sectionTemplate = document.querySelector('#portrait-detail').innerHTML;
            let template = Handlebars.compile(sectionTemplate);
            let data = template({
                portrait: portrait
            });

            document.querySelector('#main-section').innerHTML = data;

            self.portraitFactory.detectFace(portrait).then(function(faceData) {
                console.log(faceData)
                self.portraitFactory.findSimilars(faceData[0].faceId).then(function(similarPortraits){
                    console.log(similarPortraits)
                    let data = template({
                        portrait: portrait,
                        similarPortraits: similarPortraits
                    });

                    document.querySelector('#main-section').innerHTML = data;
                    document.querySelector('#loader').style.display = 'none';
                });

            });
        },
        indexOverview: function() {
            document.querySelector('#main-section').innerHTML = '';
            document.querySelector('#loader').style.display = 'block';
            // document.querySelector('#main-section').innerHTML += 'loading portraits';
            let sectionTemplate = document.querySelector('#index-overview').innerHTML;
            let template = Handlebars.compile(sectionTemplate);

            let data = template({
                'test':'test'
            });

            document.querySelector('#main-section').innerHTML += data;
            document.querySelector('#loader').style.display = 'none';
        },
        indexItems: function() {
            document.querySelector('#main-section').innerHTML = '';
            let sectionTemplate = document.querySelector('#index-items').innerHTML;
            let template = Handlebars.compile(sectionTemplate);
            let self = this;

            let data = template({
                'title':'Items ophalen van de adamnet api...'
            });
            document.querySelector('#main-section').innerHTML = data;

            self.portraitFactory.getPortraits().then(function(portraits) {
                let rows = portraits.results.bindings; // get the results
                let interval = 4;
                let totalSeconds = rows.length * interval;


                // Loop through the results and index every record in the Azure Face API
                for (var i=0;i<=rows.length-1;i++) {
                   (function(ind) {
                       setTimeout(function(){

                           self.portraitFactory.indexPortrait(rows[ind]);

                           let progressPercentage = (ind+1)/rows.length*100;
                           data = template({
                               'title':'Uploaden van items naar de Microsoft Azure Face API',
                               'totalMinutes': Number(totalSeconds / 60).toFixed(1),
                               'minutesLeft': Number((totalSeconds - ind * interval) / 60).toFixed(1),
                               'itemsAmount': rows.length,
                               'index': ind+1   ,
                               'item': rows[ind],
                               'progressPercentage': Number(progressPercentage).toFixed(2),
                               'complete': false
                           });

                            //    console.dir(self.portraitFactory.portraits);

                           if(ind === rows.length-1) {
                               data = template({
                                   'title':'Bezig met opslaan van items',
                                   'progressPercentage': '',
                               });
                               setTimeout(function(){
                                   self.portraitFactory.savePortraitsToLocalStorage();

                                   data = template({
                                       'title':'Klaar!',
                                       'progressPercentage': 100,
                                       'complete': true
                                   });
                                   document.querySelector('#main-section').innerHTML = data;
                               },1000*interval);
                           }

                           document.querySelector('#main-section').innerHTML = data;

                    }, ((1000*interval) * ind));
                   })(i);
               }


            });
        }
    };
    routie({
    '': function() {
        const portraitFactory = new PortraitFactory();
        if(portraitFactory.isPortraitsIndexed()) {
            console.log(portraitFactory.portraits);
            page.portraitOverview();
        } else {
            page.indexOverview();
        }
    },
    'portrait/:id': function(id) {
        page.portraitDetail(id);
    },
    'indexitems': function() {
        const portraitFactory = new PortraitFactory();
        if(!portraitFactory.isPortraitsIndexed()) {
            page.indexItems();
        } else {
            window.location = "#";
        }
    }
});
    // Dynamic route to look up paintings by any artist
    // routie('/testindex', function() {

        //  var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
         //
        //  fetch(queryurl)
        //     .then((resp) => resp.json()) // transform the data into json
        //     .then(function(data) {
        //         let rows = data.results.bindings; // get the results
         //
        //         const api = new Api(apiConfig);
        //         const endpoints = api.getEndpointsForApi('azureFaceAPI');
         //
        //         let totalSeconds = rows.length * 5;
        //         console.log("indexing faces")
                // for (var i=0;i<=rows.length;i++) {
                //     (function(ind) {
                //         setTimeout(function(){
                //             endpoints.largeFaceList.addFace.body.url = rows[ind].img.value;
                //             endpoints.largeFaceList.addFace.body.userData = rows[ind].cho.value;
                //
                //
                //             console.log(endpoints.largeFaceList.addFace.body.url);
                //
                //             console.log(ind + " of " + rows.length);
                //             console.log((totalSeconds - ind * 5) / 60 + " minutes left");
                //
                //             api.request('azureFaceAPI', endpoints.largeFaceList.addFace).then(function(data) {
                //                 console.log(data);
                //             }).catch(function(err){
                //                 console.log(err);
                //             });
                //         }, 1000 + (5000 * ind));
                //     })(i);
                // }

                // for(let row of rows) {
                //     endpoints.largeFaceList.addFace.body.url = row.img.value;
                //     console.log(endpoints.largeFaceList.addFace.body.url);

                // }

            // }).catch(function(error) {
            //     // if there is any error you will catch them here
            //     console.log(error);
            // });

        // page.artistOverview('Rembrandt');


        // api.request('azureFaceAPI', endpoints.detect.POST).then(function(data) {
        //     console.log(data);
        // }).catch(function(err){
        //     console.log(err);
        // });
    // });
})();
