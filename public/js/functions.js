const addListener = chrome.runtime.onMessage.addListener(function(params, sender, sendResponse) {
    sendResponse(eval(`${params.func}(${JSON.stringify(params.params)});`));
});

async function sleep(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

function randomIntegerNumber (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function waitLoading(attemp = 0) {
    const loading = document.querySelector('[data-visualcompletion="loading-state"]');
    if(!loading) return true;
    else if(attemp >= 30) return false;
    await sleep(1000);
    return await waitLoading(++attemp);
}

function addComments(params) {
    const { listComments, intervalBetweenComments, intervalGroupComments, groupOfComments } = params;

    if(!listComments || !intervalBetweenComments || !intervalGroupComments || !groupOfComments) {
        alert('Preencha todos os campos!');
        return false;
    }

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;

    let comments = 0;
    let errors = 0;
    const listOfComments = listComments.split('\n');

    const comment = async () => {
        const inputComment = document.querySelector(`[placeholder*="comentário"]`);
        const buttonComment = document.querySelector(`form[method="POST"] [data-testid="post-comment-input-button"]`);

        if(!inputComment || !buttonComment) {
            alert('Não foi possível encontrar o campo de comentário!');
            return false;
        }

        let wait = randomIntegerNumber(+intervalBetweenComments, +intervalBetweenComments + 5);

        const randomComment = randomIntegerNumber(0, listOfComments.length - 1);
        const commentText = listOfComments[randomComment];
        const date = new Date().toLocaleString();

        nativeInputValueSetter.call(inputComment, commentText);
        inputComment.dispatchEvent(new Event('input', { bubbles: true}));
        buttonComment.click();
        
        if(!await waitLoading()) {
            alert('Tempo excedido para inserção de comentário. Reinicie o BOT!');
            location.reload();
            return false;
        }

        await sleep(500);

        let error = document.querySelector('.gxNyb');
        if(error) {
            errors++;
            console.log(`[${date}] ${error.innerText} - Erro ${errors}`);

            if(errors >= 10) {
                errors = 0;
                wait += 15 * 60;
            }
        } else {
            errors = 0;
            comments++;
            console.log(`[${date}] Comentário ${comments}: ${commentText}`);

            if(comments % groupOfComments == 0) wait += +intervalGroupComments;
        }
    
        console.log(`[${date}] Aguardando ${wait} segundos`);
        setTimeout(comment, wait * 1000);
    }

    comment();

    return true;
}