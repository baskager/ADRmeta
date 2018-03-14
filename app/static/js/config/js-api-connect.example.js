// example config using the Rijksmuseum API
const apiConfig = {
    adamnet: {
        key: false,
        baseUrl: 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint',
        endpoints: {
            sparql: {
                GET: {
                    path: '/sparql',
                    httpMethod: 'GET',
                    params: {
                        //&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on
                        query: '',
                        format: 'application%2Fsparql-results%2Bjson',
                        timeout: 0,
                        debug: 'on'
                    },
                    body: {},
                    headers: []
                },
            }, //end of sparql
        }
    },
    azureFaceAPI: {
        key: false,
        baseUrl: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0',
        endpoints: {
            face: {
                detect: {
                    path: '/detect',
                    httpMethod: 'POST',
                    params: {
                        returnFaceId: true,
                        returnFaceLandmarks: false,
                        returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
                    },
                    body: {
                        url: ''
                    },
                    headers: [
                        ['Content-Type','application/json'],
                        ['Ocp-Apim-Subscription-Key', 'INSERT-YOUR-API-KEY']
                    ]
                },
                findSimilars: {
                    path: '/findSimilars',
                    httpMethod: 'POST',
                    params: {},
                    body: {
                        faceId: '',
                        largeFaceListId: 'adrmetav7',
                        mode: 'matchPerson'
                    },
                    headers: [
                        ['Content-Type','application/json'],
                        ['Ocp-Apim-Subscription-Key', 'INSERT-YOUR-API-KEY']
                    ]
                }
            }, //end of face
            largeFaceList: {
                addFace: {
                    path: '/largefacelists/adrmetav7/persistedFaces',
                    httpMethod: 'POST',
                    params: {
                        largeFaceListId: 'adrmetav7',
                    },
                    body: {
                        url: ''
                    },
                    headers: [
                        ['Content-Type','application/json'],
                        ['Ocp-Apim-Subscription-Key', 'INSERT-YOUR-API-KEY']
                    ]
                }
            } // end of faceList
        }
    }
};

export default apiConfig;
