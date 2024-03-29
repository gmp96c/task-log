const userIsAdmin = ({ authentication: { item: user } }) =>
    Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
    if (!user) {
        return false;
    }
    // Instead of a boolean, you can return a GraphQL query:
    // https://www.keystonejs.com/api/access-control#graphqlwhere
    return { id: user.id };
};
const userExists = ({ authentication: { item: user } }) => !!user;

const userIsAdminOrOwner = (auth) => {
    const isAdmin = userIsAdmin(auth);
    const isOwner = userOwnsItem(auth);
    return isAdmin || !!isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner, userExists };

// const access = {
//     userIsAdmin: () => true,
//     userOwnsItem: () => true,
//     userIsAdminOrOwner: () => true,
//     userExists: () => true,
// };
module.exports = { access };
