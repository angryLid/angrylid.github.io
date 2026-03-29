import dayjs from 'dayjs';


export function formatCreatedTime(createdTime: string) {
    return dayjs(createdTime).format('YYYY-MM-DD')
}