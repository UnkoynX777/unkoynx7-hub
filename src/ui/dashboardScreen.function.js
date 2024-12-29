// chalk - colorize text
const { magenta, yellow, cyan, gray, red, green } = require("chalk");

// figlet - ASCII representation
const { textSync } = require("figlet");

// nanospinner - loading spinner
const { createSpinner } = require("nanospinner");

// inquirer - interactive prompts
const inquirer = require("inquirer");

// readline - read entries
const { createInterface } = require("readline");

// imports - functions
const startDownloadProcess = require('../script/automation.function');

// function to display home screen
function showDashboardScreen() {

    // console - clear
    console.clear();

    // draw a title with ASCII art
    console.log(magenta(textSync(" UnkoynX7 HUB", { horizontalLayout: 'default', font: 'Slant' })));

    // additional information
    console.log(yellow("\n   [*] Criado com paixão e dedicação por UnkoynX7"));
    console.log(gray("   [!] Este projeto é open-source https://github.com/UnkoynX777/unkoynx7-hub."));
    console.log(gray("   [!] Este projeto está em constante evolução. Se você encontrar algum erro, não hesite em entrar em contato."));
    console.log(gray("   [!] Este projeto foi desenvolvido sem qualquer tipo de apoio financeiro.\n"));
    console.log(cyan(`   Bem-vindo ao UnkoynX7 HUB - Sua central de downloads e suporte!`));
    console.log(gray(`   ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\n`));

    try {

        // add delay execute menu
        const spinner = createSpinner(" Preparando sua experiência...").start();
        setTimeout(() => {
            spinner.success({ text: "Tudo pronto para começar!" });
            showMenu();
        }, 3500);
    } catch (error) {
        console.log(red("   [!] Erro: Houve um problema ao inicializar o sistema."));
        pauseAndReturnToMenu();
    }
    return;
};

// function to display interactive menu
async function showMenu() {

    // console - clear
    console.clear();

    // draw a title with ASCII art
    console.log(magenta(textSync(" UnkoynX7 HUB", { horizontalLayout: 'default', font: 'Slant' })));

    // additional information
    console.log(yellow("\n   [*] Criado com paixão e dedicação por UnkoynX7"));
    console.log(gray("   [!] Este projeto é open-source https://github.com/UnkoynX777/unkoynx7-hub."));
    console.log(gray("   [!] Este projeto está em constante evolução. Se você encontrar algum erro, não hesite em entrar em contato."));
    console.log(gray("   [!] Este projeto foi desenvolvido sem qualquer tipo de apoio financeiro.\n"));
    console.log(magenta("   [*] Chave PIX (aleatória): 6509bf34-fa63-4cd2-b729-09a3e4c8611f\n"));

    // displays menu options
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: `${gray(" Como podemos ajudar você hoje?")}`,
            choices: [
                { name: `${green(" ( 1 ) Fivem External - Basic")}`, value: "1" },
                { name: `${green(" ( 2 ) Fivem External - Advanced")}`, value: "2" },
                { name: `${green(" ( 3 ) Spoofer - Temporary")}`, value: "3" },
                { name: `${green(" ( 4 ) Spoofer - Permanent")}`, value: "4" },
                { name: `${red(" ( 0 ) Encerrar Programa")}`, value: "0" }
            ]
        }
    ]);

    // answers - option
    switch (answers.option) {
        case "1":
            executeDownloads("1");
            break;
        case "2":
            executeDownloads("2");
            break;
        case "3":
            executeDownloads("3");
            break;
        case "4":
            executeDownloads("4");
            break;
        case "0":
            console.log(red("\n   Até logo! Esperamos você em breve."));
            process.exit();
        default:
            console.log(red("\n   [!] Opção não reconhecida."));
            pauseAndReturnToMenu();
    };
};

// function to return to the menu
function pauseAndReturnToMenu() {

    // readline - interface
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // readline - question - back menu
    rl.question(gray("\n   [VOLTAR] Pressione ENTER para retornar ao menu..."), () => {

        // close readline interface
        rl.close();

        // showMenu - clear
        console.clear();
        showMenu();
    });
};

// function to execute downloads
function executeDownloads(option) {
    startDownloadProcess(option).then(() => {
        pauseAndReturnToMenu();
    }).catch((error) => {
        console.error(error);
        pauseAndReturnToMenu();
    });
};

// exports - functions
module.exports = { showDashboardScreen };