import { ErrorHandling } from "../Util/errorHandling.js";
var errorHandling = new ErrorHandling();

export class Message {
    URL;
    async get(params) {
        this.settingUrl('/Controller/CLPP/Message.php?app_id=7&AUTH=', params)       
        let req;
        await fetch(this.URL)
            .then(response => response.json())
            .then(body => {
                if (body.error) throw new Error(body.message)
                req = body.data
            })
            .catch(erro => {
                errorHandling.main(erro)
            })
        return req;
    }
    async post(params) {
        let req
        this.settingUrl('/Controller/CLPP/Message.php?app_id=7&AUTH=');
        await fetch(this.URL,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(body =>{
            if(body.error) throw Error(body.message)
            req = body;
        }).catch(error => errorHandling.main(error))
        return req;
    }
    settingUrl(middlewer,params){
        let server = localStorage.getItem('server');
        let token = localStorage.getItem('token');
        this.URL = server + middlewer + token + params
    }
}