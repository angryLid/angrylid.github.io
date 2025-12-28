import dayjs from 'dayjs';


export function formatCreatedTime(createdTime: string, locale = 'en') {
    const formatConfig = {
        zh: 'YYYY 年 MM 月 DD 日',
        en: 'MMM D, YYYY',
    }
    return dayjs(createdTime).format(formatConfig[locale])
}