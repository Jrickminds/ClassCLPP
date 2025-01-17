import { Checklist } from "../../Connection/Checklist.js";
import { Employee } from "../../Connection/Employee.js";
import { UsefulComponents } from "../../Util/usefulComponents.js";
import { UserAccess } from "../../Connection/UserAccess.js"
import { Message } from "../../Connection/Message.js";
import { MessageList } from "../../Components/messageList.js";
import { SettingHome } from "./settingHome.js";

var employee = new Employee;
var usefulComponents = new UsefulComponents;
var checklist = new Checklist
var userAccess = new UserAccess;
var message = new Message;
var listMessage = new MessageList()

export class HomePage extends SettingHome {
    userJson;
    accessClpp;
    checklistJson;
    message;

    async main() {

        this.userJson = await employee.get();
        this.checklistJson = await checklist.get('&web&userId=' + localStorage.getItem('id'));
        this.accessClpp = await userAccess.get('&application_id=7&web');
       
        let nameUser = usefulComponents.splitStringName(this.userJson.name, " ")
       
        let response =
            `
        <div id="homeDiv">
            <section id="homeLeft">
                <header id="welcom">
                    <h1>Bem Vindo, ${nameUser} ao CLPP</h1>
                    <p><b>Informações:</b> ${this.userJson.company + " -> " + this.userJson.shop + " -> " + this.userJson.departament + " -> " + this.userJson.sub}</p>
                </header>
                <div id="bodyHome">
                    <div id="messageDiv">
                        <header class= "dashboardHome">
                            <h1> Mensagens não Visualizadas: </h1>
                        </header>
                        <div id="bodyChDiv">
                            ${await this.messageReceived()}
                        </div>
                    </div>
                    <div id="checkResponseDiv">
                        <header class= "dashboardHome">
                            <h1> Checklist Respondidos: </h1>
                        </header>
                    </div>
                </div>
            </section>
            <aside id="homeRight">
                <div id="checkDiv">
                    <header><h1>Cabeçalho do Checklist</h1></header>
                    <div id=bodyCheckDiv>
                        ${this.checklistJson.map((element) => (
                            `<div class="cardCheck" id="check_${element.id}">
                                <header><p>${element.description.slice(0, 14) + "..."}</p></header>
                                <section>
                                    <p><b>Notificação:</b> ${element.notification == 1 ? "Sim" : "Não"}</P>
                                    <p><b>Data:</b><br/> ${element.date_init ? "Inicial: " + element.date_init + " <br/> " + "Final:  " + element.date_final : "Não Possuí Válidade Definida."}</P>
                                </section>
                            </div>`
                        )).join("")}
                    </div>   
                </div>
                <div id="recordDiv">
                    <header><h1>Cabeçalho dos Relatórios </h1></header>
                </div>
            </aside>
        </div>
        `
        return response;
    }
    async messageReceived() {
        await listMessage.separator(await message.get("&id=" + localStorage.getItem('id')))
        console.log(listMessage.notSeen())
        if(document.getElementById('bodyChDiv')) document.getElementById('bodyChDiv').innerHTML = ""
        return listMessage.notSeen().map((element) => (
            `<div class="cardMessageUser" id="user_${element.id_user}">
                    <img class="photosUsers" src ="${element.photo.src}" />
                    <p>${usefulComponents.splitStringName(element.description, " ")}</p>
            </div>`
        )).join("")
    }
}