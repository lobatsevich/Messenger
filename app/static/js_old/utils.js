function getHHMM(timestamp) {
    const timeString = new Date(timestamp);
    const hours = timeString.getHours();
    const minutes = timeString.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function messageIsClear(content) {
    clearContent = content.split(' ').join('').split('\n').join('');
    return clearContent ? false : true;
}

function cleanMessageWhitespace(message) {
    let start = 0;
    let end = message.length - 1;

    while (start < message.length 
        && (message[start] === ' ' 
        || message[start] === '\n')) 
        start++;

    while (end >= start  
        && (message[end] === ' '  
        || message[end] === '\n')) 
        end--;

    return message.substring(start, end + 1);
}
  
function getMinutesWord(minutes) {
    const lastDigit = minutes % 10;
    if (minutes >= 11 && minutes <= 14) {
    return 'минут';
    } else if (lastDigit === 1) {
    return 'минуту';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'минуты';
    } else {
    return 'минут';
    }
}

function getHoursWord(hours) {
    const lastDigit = hours % 10;
    if (hours >= 11 && hours <= 14) {
    return 'часов';
    } else if (lastDigit === 1) {
    return 'час';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
    } else {
    return 'часов';
    }
}

function getMonthName(month) {
    const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return months[month];
}

function getTimestampFromChatList(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    
    const timeDifference = today.getTime() - date.getTime();
    if (date.toDateString() === today.toDateString()) {
        return getHHMM(timestamp);
    } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const dayOfWeek = date.getDay();
        return daysOfWeek[dayOfWeek];
    } else {
        return date.toLocaleDateString();
    }
}

function scrollToBottom() {
    const messageHistoryContainer = document.getElementById('chat');
    messageHistoryContainer.scrollTop = messageHistoryContainer.scrollHeight;
}