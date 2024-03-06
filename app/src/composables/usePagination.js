import { ref, computed } from 'vue';

export function usePagination(data) {
    const currentPage = ref(1);
    const pageSize = ref(100);

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return data.value.slice(start, end);
    });

    const totalPages = computed(() => {
        return Math.ceil(data.value.length / pageSize.value);
    });

    function setPage(page) {
        currentPage.value = page;
    }

    function resetPage() {
        currentPage.value = 1;
    }

    return { paginatedData, currentPage, setPage, totalPages, resetPage };
}
