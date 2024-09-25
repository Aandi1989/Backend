export function sortUserStatistics(users, sortCriteria) {
    if (typeof sortCriteria === 'string') {
        sortCriteria = [sortCriteria];
    }

    return users.sort((a, b) => {
        for (let i = 0; i < sortCriteria.length; i++) {
            const [key, order] = sortCriteria[i].split(' ');
            if (a[key] < b[key]) {
                return order === 'desc' ? 1 : -1;
            } else if (a[key] > b[key]) {
                return order === 'desc' ? -1 : 1;
            }
        }
        return 0; // if all criteria are equal, maintain order
    });
}

