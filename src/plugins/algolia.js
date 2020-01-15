const algoliasearch = require('algoliasearch');

const algolia = algoliasearch(
    process.env.VUE_APP_ALGOLIA_APP_ID,
    process.env.VUE_APP_ALGOLIA_API_KEY
);

const contentGroupsIndex = algolia.initIndex('contentGroups');
const studentMaterialsIndex = algolia.initIndex('studentMaterials');
const teacherMaterialsIndex = algolia.initIndex('teacherMaterials');
const motivationMaterialsIndex = algolia.initIndex('motivationMaterials');
const appUsersIndex = algolia.initIndex('appUsers');

export {
    algolia,
    contentGroupsIndex,
    studentMaterialsIndex,
    teacherMaterialsIndex,
    motivationMaterialsIndex,
    appUsersIndex
}