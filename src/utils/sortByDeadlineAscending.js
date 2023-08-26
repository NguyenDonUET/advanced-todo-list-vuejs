export function sortByDeadlineAscending(list) {
    list.sort((a, b) => {
        const deadlineA = new Date(
            a.deadline.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
        );
        const deadlineB = new Date(
            b.deadline.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
        );

        return deadlineA - deadlineB;
    });
}
