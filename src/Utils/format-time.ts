import moment from 'moment-timezone';

export const formatThaiDate = (dateString: string | Date, isAbbreviation?: boolean, format?: string) => {
    if (!dateString) return '';
    const date = moment.utc(dateString).locale('th').tz('Asia/Bangkok');
    const buddhistYear = convertToBuddhistYear(date.year());

    const months: {
        [key: number]: string;
    } = {
        0: 'มกราคม',
        1: 'กุมภาพันธ์',
        2: 'มีนาคม',
        3: 'เมษายน',
        4: 'พฤษภาคม',
        5: 'มิถุนายน',
        6: 'กรกฎาคม',
        7: 'สิงหาคม',
        8: 'กันยายน',
        9: 'ตุลาคม',
        10: 'พฤศจิกายน',
        11: 'ธันวาคม',
    };
    const monthsAbbreviation: {
        [key: number]: string;
    } = {
        0: 'ม.ค.',
        1: 'ก.พ.',
        2: 'มี.ค.',
        3: 'เม.ย.',
        4: 'พ.ค.',
        5: 'มิ.ย.',
        6: 'ก.ค.',
        7: 'ส.ค.',
        8: 'ก.ย.',
        9: 'ต.ค.',
        10: 'พ.ย.',
        11: 'ธ.ค.',
    };
    const formatDate = (() => {
        switch (format) {
            case 'date':
                return 'DD MMMM YYYY';
            case 'month-year':
                return 'MMMM YYYY';
            default:
                return 'DD MMMM YYYY, HH:mm';
        }
    })();
    const formattedDate = date
        .format(formatDate)
        .replace(date.year().toString(), buddhistYear.toString())
        .replace(date.format('MMMM'), isAbbreviation ? monthsAbbreviation[date.month()] : months[date.month()]);
    return formattedDate;
};

export const convertToBuddhistYear = (year: number) => {
    const isBuddhistYear = year > 2500;
    return isBuddhistYear ? year : year + 543;
};

export const formatThaiDateMonthYear = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = moment.utc(dateString).locale('th').tz('Asia/Bangkok');
    const buddhistYear = convertToBuddhistYear(date.year());

    const months: {
        [key: number]: string;
    } = {
        0: 'มกราคม',
        1: 'กุมภาพันธ์',
        2: 'มีนาคม',
        3: 'เมษายน',
        4: 'พฤษภาคม',
        5: 'มิถุนายน',
        6: 'กรกฎาคม',
        7: 'สิงหาคม',
        8: 'กันยายน',
        9: 'ตุลาคม',
        10: 'พฤศจิกายน',
        11: 'ธันวาคม',
    };

    const formattedDate = date.format(`DD ${months[date.month()]} ${buddhistYear}`);
    return formattedDate;
};
