<template>
<header>
    <nav>
        <ul>
            <li>
                <nuxt-link to="/profile">Giám sát</nuxt-link>
            </li>
            <li>
                <nuxt-link to="/decks/1">Lộ trình</nuxt-link>
            </li>
            <li>
                <nuxt-link to="/ab">Báo cáo</nuxt-link>
            </li>
            <li>
                <nuxt-link to="/aqwe">Đăng xuất</nuxt-link>
            </li>
        </ul>
    </nav>
</header>
</template>

<style>
header {
    background: aquamarine;
    color: rgba(36, 67, 49, 0.472);
    height: 60px;

    nav,
    ul {
        height: inherit;
    }

    ul {
        align-items: center;
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            margin: 0 1.5em;
            a {
                color: orange;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }

                &.nuxt-link-exact-active {
                    color: red;
                }
            }
        }

    }
}
</style>
