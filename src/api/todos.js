const filterTodosByTitle = async (titleValue) => {};

const filterTodosByPriority = async () => {
    if (priority.value === "") {
        getTodosFromDB();
        return;
    }
    let statusVal = JSON.parse(status.value);
    const q = query(
        collection(db, "todos"),

        where("priority", "==", priority.value)
    );
    getTodosFromDB(q);
};

const filterTodosByStatus = async () => {
    if (status.value === "") {
        filterTodosByPriority();
        return;
    }
    const isFilterByExpired = status.value === "expired";
    let q;
    // nếu lọc theo ngày hết hạn: date < Date.now()
    if (isFilterByExpired) {
        const todayTimestamp = Date.now();
        q = query(collection(db, "todos"), where("date", "<", todayTimestamp));
    } else {
        let statusVal = JSON.parse(status.value);
        q = query(
            collection(db, "todos"),
            where("priority", "==", priority.value),
            where("completed", "==", statusVal)
        );
    }
    getTodosFromDB(q);
};
