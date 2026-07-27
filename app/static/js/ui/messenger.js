import { initLayout, toggleCompanionInfoContainer } from './layout.js';
import { initProfileUI, displayProfile } from './profile.js';
import { initSearchUI } from './search.js';
import { displayCompanionInfo, displayChatHeader } from './companion.js';
import { initKeyboard } from './keyboard.js';

export function initUI() {
    initLayout();
    initProfileUI();
    initSearchUI();
    initKeyboard();
}

export { displayProfile, displayChatHeader, displayCompanionInfo, toggleCompanionInfoContainer };
