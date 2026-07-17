// Global vitest setup: install a fake IndexedDB before any module under
// test (idb-keyval / progress-store) is imported, so IDB-backed code runs
// unmodified in the node test environment.
import 'fake-indexeddb/auto'
