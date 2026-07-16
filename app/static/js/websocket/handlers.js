import { renderMessage } from "../ui/messages.js"


export function handleEvent(event) {

    switch (event.type) {
        case "new_message":
            renderMessage(
                event.message
            );
            break;
    }
}