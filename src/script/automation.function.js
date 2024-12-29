const { join } = require("path");
const fs = require("fs");

const { magenta, yellow, cyan, gray, green } = require("chalk");

const axios = require("axios");

const { textSync } = require("figlet");

const { JsonDatabase } = require("wio.db");
const dbDownloads = new JsonDatabase({ databasePath: join(__dirname, "../../database/dbDownloads.json") });

const Seven = require('node-7z');
const sevenBin = require('7zip-bin');

const { exec } = require('child_process');

const readline = require('readline');

async function checkUrlExists(url) {
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch {
        return false;
    }
}

function promptForToken() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(cyan('\n   [*] Para saber como obter seu token do Discord, assista a este tutorial: https://www.youtube.com/watch?v=bMjXRDG3aHA&t=11s'));

    return new Promise((resolve) => {
        rl.question(cyan('\n   [?] Por favor, insira seu token do Discord: '), (token) => {
            rl.close();
            resolve(token);
        });
    });
}
async function validateToken(token) {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: token }
        });
        return response.status === 200;
    } catch {
        return false;
    }
}

async function checkVirtualizationEnabled() {
    const command = 'powershell "(Get-CimInstance Win32_Processor).VirtualizationFirmwareEnabled"';
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(stderr));
            }
            resolve(stdout.trim() === 'True');
        });
    });
}

async function checkIfLocalAccount() {
    return new Promise((resolve, reject) => {
        exec('systeminfo', (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Erro ao executar o comando: ${error}`));
            }

            const logonServerLine = stdout.split('\n').find(line => line.includes('Servidor de Logon'));

            if (logonServerLine) {
                if (logonServerLine.includes('\\\\WINDOWS')) {
                    console.log(cyan("\n   [*] Possivelmente uma conta da Microsoft foi detectada."));
                    resolve(false);
                } else {
                    console.log(cyan("\n   [*] Conta Local detectada."));
                    resolve(true);
                }
            } else {
                console.log(yellow("\n   [-] Informação do Servidor de Logon não encontrada."));
                resolve(false);
            }
        });
    });
}

module.exports = async function startDownloadProcess(option) {
    try {
        console.log(cyan("\n   [*] Iniciando o processo de download dos requisitos..."));
        const requirements = dbDownloads.get("downloads.requirements");
        let success = false;

        let selectedRequirements;
        if (option === "1" || option === "2") {
            selectedRequirements = [requirements[0], requirements[1], requirements[2], requirements[3]];
        } else if (option === "3" || option === "4") {
            selectedRequirements = [requirements[0], requirements[1]];
        };

        for (const url of selectedRequirements) {
            if (!await checkUrlExists(url)) continue;

            const fileName = url.split('/').pop();
            console.log(gray(`   → Baixando: ${fileName}`));
            if (fileName === "OBS-Studio-31.0.0-Windows-Installer.exe" || fileName === "winrar-x64-701br.exe") {
                console.log(yellow(`   [!] Não mude o diretorio de download, ele é necessário para o funcionamento do cheat.`));
            }

            await downloadFile(url, fileName);

            if (fileName.endsWith('.exe')) {
                await executeFile(fileName);
                success = true;
            }
        }

        if (!success) {
            throw new Error("   [-] Nenhum requisito foi baixado com sucesso.");
        }

        console.log(cyan(`\n   [*] Desative o Windows Defender.`));
        console.log(gray(`   → Executando: dControl.exe`));
        await executeDcontrol();

        console.log(cyan("\n   [*] Todos os requisitos foram processados com sucesso."));

        const loaders = dbDownloads.get("downloads.loaders");
        const passwords = dbDownloads.get("passwords");
        const selectedLoader = loaders[parseInt(option) - 1];
        const selectedPassword = passwords[parseInt(option) - 1];

        if (!selectedLoader) throw new Error("   [-] Loader não encontrado.");

        console.log(cyan("\n   [*] Iniciando o download do arquivo principal..."));
        const downloadUrl = selectedLoader.replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/');

        if (!await checkUrlExists(downloadUrl)) throw new Error("   [-] URL de download não existe.");

        const fileName = selectedLoader.split('/').pop();
        await downloadFile(downloadUrl, fileName);
        console.log(gray(`   → Arquivo principal baixado: ${fileName}`));

        if (fileName.endsWith('.zip')) {
            await extractFile(fileName, selectedPassword);

            if (option === "3" || option === "4") {
                console.log(cyan("\n   [*] Extraindo e executando scripts PowerShell..."));
                await executePowerShellScripts(option);
            }

            if (option === "3") {
                let token;
                do {
                    token = await promptForToken();
                    if (!await validateToken(token)) {
                        console.log(yellow("   [-] Token inválido. Tente novamente."));
                    }
                } while (!await validateToken(token));

                const removeFiveMApp = require('./api/removeFiveM.function');
                await new Promise((resolve, reject) => {
                    removeFiveMApp(token)
                        .then(() => resolve())
                        .catch(err => reject(err));
                });


                const isVirtualizationEnabled = await checkVirtualizationEnabled();
                console.log(cyan(`\n   [*] Virtualização está ${isVirtualizationEnabled ? 'ativa' : 'inativa'}.`));

                if (!isVirtualizationEnabled) {
                    console.log(yellow("   [-] Virtualização está inativa. O processo será interrompido."));
                    console.log(cyan("   [*] Para saber como ativar a virtualização do processador pela BIOS, assista a este tutorial: https://www.youtube.com/results?search_query=como+ativar+a+virtualiza%C3%A7%C3%A3o+do+processador+pela+bios"));
                    return;
                }

                const isLocalAccount = await checkIfLocalAccount();
                if (!isLocalAccount) {
                    console.log(yellow("   [-] O processo será interrompido até que você mude para uma conta local."));
                    console.log(cyan("   [*] Para saber como mudar para uma conta local, assista a este tutorial: https://www.youtube.com/watch?v=IynYSf-zRds"));
                    return;
                }
            };
        }

        if (option === "3" || option === "4") {
            console.log(cyan("\n   [*] Utilize o spoofer para remover o banimento!"));
        } else if (option === "1" || option === "2") {
            console.log(cyan("\n   [*] Cheat aberto com sucesso!"));
        }

        let loader;
        switch (option) {
            case "1":
                loader = "VencordInstaller.exe";
                break;
            case "2":
                loader = "RobloxPlayerInstaller.exe";
                break;
            case "3":
                loader = "Loader_2.5.exe";
                break;
            case "4":
                loader = "WooferPerma.exe";
                break;
        }
        console.log(gray(`   → Executando: ${loader}`));
        await executeFile(loader, option);

        console.log("\n")
        console.log(magenta(textSync(" Instrucoes", { horizontalLayout: 'default', font: 'ANSI Shadow' })));

        if (option === "3") {
            console.log(cyan("   [*] Coloque um rockstar nova para remover o banimento do FiveM/cidades."));
            console.log(cyan("   [*] Caso você quiser remover o banimento de cidade, utilize uma VPN antes de entrar na cidade."));
            console.log(cyan("   [*] Caso precise da steam/epic para entrar na cidade, crie outra conta e entre na cidade com ela."));
        } else if (option === "4") {
            console.log(cyan("   [*] Use a opção 1 e depois a 2."));
            console.log(cyan("   [*] Coloque um rockstar nova para remover o banimento do FiveM/cidades."));
            console.log(cyan("   [*] Caso precise da steam/epic para entrar na cidade, crie outra conta e entre na cidade com ela."));
        } else if (option === "1" || option === "2") {
            console.log(cyan("   [*] Video de como usar o cheat: https://www.youtube.com/watch?v=Qqs6TFttlGQ"));
            console.log(cyan("   [*] Reduza a resolução do jogo para evitar problemas de compatibilidade."));
            console.log(cyan("   [*] Experimente alternar entre os modos de tela cheia exclusiva e tela cheia normal para melhorar a compatibilidade."));
            console.log(cyan("   [*] Certifique-se de que a resolução do Windows e do jogo sejam as mesmas para evitar problemas de compatibilidade."));
            console.log(cyan("   [*] Verifique sua conexão com a internet - recomenda-se uma conexão Wi-Fi estável ou uma conexão via cabo de rede."));
            console.log(cyan("   [*] Mantenha TODOS os drivers do seu computador atualizados através do Windows Update ou dos sites oficiais dos fabricantes (EXTREMAMENTE IMPORTANTE)."));
            console.log(cyan("   [*] Se os problemas persistirem mesmo após a atualização dos drivers, considere realizar uma instalação limpa do Windows 10 Pro original usando um pendrive bootável."));
        }

    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

async function downloadFile(url, fileName) {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });

    const filePath = join(__dirname, '../../downloads', fileName);

    if (!fs.existsSync(join(__dirname, '../../downloads'))) {
        fs.mkdirSync(join(__dirname, '../../downloads'), { recursive: true });
    }

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function executeFile(fileName, option) {
    const filePath = join(__dirname, '../../downloads', fileName);
    const command = `Start-Process -FilePath "${filePath}" -Wait`;

    if (option === "1" || option === "2") {
        exec(command, { shell: 'powershell' }, (error) => {
            if (error) {
                console.error(`   [-] Erro ao executar o arquivo: ${error.message}`);
                throw error;
            }
        });
    } else {
        await new Promise((resolve, reject) => {
            exec(command, { shell: 'powershell' }, (error) => {
                if (error) {
                    console.error(`   [-] Erro ao executar o arquivo: ${error.message}`);
                    return reject(error);
                }
                resolve();
            });
        });
    }
}

async function executeDcontrol() {
    const dControlPath = join(__dirname, '../../downloads/windows', 'dControl.exe');
    const command = `Start-Process -FilePath "${dControlPath}" -Wait`;

    await new Promise((resolve, reject) => {
        exec(command, { shell: 'powershell' }, (error) => {
            if (error) {
                console.error(`   [-] Erro ao abrir o dControl: ${error.message}`);
                return reject(error);
            }
            resolve();
        });
    });
}

async function extractFile(fileName, password) {
    const filePath = join(__dirname, '../../downloads', fileName);
    const stream = Seven.extract(filePath, join(__dirname, '../../downloads'), {
        $bin: sevenBin.path7za,
        password: password
    });

    await new Promise((resolve, reject) => {
        stream.on('end', () => {
            fs.unlink(filePath, () => resolve());
        });

        stream.on('error', reject);
    });
}

async function executePowerShellScripts(option) {

    let scripts;
    if (option === "3") {
        scripts = [
            'changeIps.ps1',
            'changeMachineGuid.ps1',
            'closeApps.ps1',
            'desableHyperVisor.ps1',
            'desableVanguard.ps1',
            'enableVulnerableDriver.ps1',
            'removeFivemLogs.ps1',
            'removeXboxApps.ps1'
        ];
    } else if (option === "4") {
        scripts = [
            'closeApps.ps1',
            'desableVanguard.ps1',
            'enableVulnerableDriver.ps1',
            'removeFivemLogs.ps1'
        ];
    }

    for (const script of scripts) {
        const scriptPath = join(__dirname, 'powershell', script);
        try {
            await executePowerShellScript(scriptPath);
            console.log(green(`   [+] Script executado com sucesso: ${script}`));
        } catch (error) {
            console.error(yellow(`   [-] Erro ao executar o script: ${script} - ${error.message}`));
        }
    }
}

async function executePowerShellScript(scriptPath) {
    await new Promise((resolve, reject) => {
        exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(stderr));
            }
            resolve();
        });
    });
}