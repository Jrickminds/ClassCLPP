import { MessageList } from "../../Components/messageList.js";
import { getB_id, $_all, $, closeModal, openModal } from "../../Util/compressSyntaxe.js";
import { UsefulComponents } from "../../Util/usefulComponents.js"
import { Validation } from "../../Util/validation.js";
import { GeneralModal } from '../../Components/generalModal/modal_geral.js'
import { Message } from "../../Connection/Message.js";
import { WebSocketCLPP } from "../../Connection/WebSocket.js";

var listMessage = new MessageList
var validator = new Validation
var generalModal = new GeneralModal;
var usefulComponents = new UsefulComponents;
var messages = new Message;
var webSocket = new WebSocketCLPP;

export class SettingHome {
    settings() {
        this.eventNotifyMessage();
    }
    openMessage() {
        getB_id('message').setAttribute('style', 'display:flex')
    }
    closeMessage() {
        getB_id('message').setAttribute('style', 'display:none')
        document.querySelector('#message :first-child').remove()
    }
    eventNotifyMessage(){
        let notify = $_all('.cardMessageUser')
        for (const iterator of notify) {
            let objectSenders = {}
            objectSenders.id = usefulComponents.splitString(iterator.getAttribute('id'), "_")[1]
            objectSenders.name = $(`#${iterator.getAttribute('id')} p`).innerText
            iterator.addEventListener('click', async () => {
                this.openMessage();
                if (document.querySelector('#message :first-child')) document.querySelector('#message :first-child').remove();
                getB_id('message').insertAdjacentHTML('beforeend', await listMessage.chatCLPP(objectSenders))
                getB_id(`${iterator.getAttribute('id')}`).remove()
                this.settingsButtonChat(objectSenders.id)
                document.querySelector('#bodyMessageDiv section').scrollTop = document.querySelector('#bodyMessageDiv section').scrollHeight;
                webSocket.informPreview(objectSenders.id)
            })
        }
    }
    settingsButtonChat(idSender) {
        getB_id('buttonReply').addEventListener('click', () => this.closeMessage());
        this.buttonSend(idSender);
    }
    buttonSend(idSender) {
        getB_id('buttonSend').addEventListener('click', async () => {
            let input = getB_id('inputSend')
            if (validator.minLength(input.value, 0) && validator.maxLength(input.value, 200)) {
                let objectSend = [['id_user', localStorage.getItem('id')], ['id_sender', idSender], ['message', input.value], ['type', '1']]
                let req=await messages.post(usefulComponents.createObject(objectSend))
                listMessage.addMessage(input.value)
                webSocket.informSending(req.last_id,idSender)
                input.value = ""
                document.querySelector('#bodyMessageDiv section').scrollTop = document.querySelector('#bodyMessageDiv section').scrollHeight;
            } else {
                this.error('Atenção! \n O campo de envio não pode estar vazio... E não deve utrapassar 200 caracteres')
            }
        })
        getB_id('inputSend').addEventListener('keypress', (enter) => { if (enter.key === 'Enter') getB_id('buttonSend').click() })
    }
    error(message) {
        openModal(generalModal.main(message, true))
        generalModal.close()
        setTimeout(() => { closeModal() }, generalModal.readingTime(message));
    }
}