const axios = require('axios');
const { green, yellow, red } = require("chalk");

module.exports = async function removeFiveMApp(token) {
    const url = "https://discord.com/api/v9/oauth2/tokens";

    const headers = {
        "Authorization": token,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json"
    };

    try {
        // Realizando a request GET
        const response = await axios.get(url, { headers: headers });

        if (response.status === 200) {
            const apps = response.data;
            let FiveMApp = null;

            for (const app of apps) {
                if (app.application.name === "FiveM") {
                    FiveMApp = app;
                    break;
                }
            }

            if (!FiveMApp) {
                console.log(yellow("   [-] Aplicativo FiveM não encontrado. Nenhuma ação necessária."));
                return;
            }

            // URL para a request DELETE
            const deleteUrl = `https://discord.com/api/v9/oauth2/tokens/${FiveMApp.id}`;

            // Realizando a request DELETE
            const deleteResponse = await axios.delete(deleteUrl, { headers: headers });

            if (deleteResponse.status === 204) {
                console.log(green("   [+] Aplicativo FiveM removido com sucesso!"));

            } else {
                throw new Error(`   [-] Erro ao remover aplicativo: ${deleteResponse.status}`);
            }
        } else {
            throw new Error(`   [-] Erro ao fazer request: ${response.status}`);
        }
    } catch (error) {
        console.error(red(`   [-] Erro ao fazer request: ${error.message}`));
        throw error;
    }
}