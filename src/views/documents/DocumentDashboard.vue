<template>
  <div class="landing mx-auto">
    <h1 class="text-center mb-3">Welcome to ToNote Link Creation</h1>

    <ul>
      <li>
        Copy a link having a document ID inclusive e.g.
        <ul>
          <li>
            <a href="https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd"
              target="_blank">
              https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd</a>
          </li>
        </ul>
      </li>
    </ul>

    <div class="my-2"></div>

    <h1 class="text-center mb-2">OR</h1>

    <p class="text-center">
      <router-link :to="{ name: 'document.upload' }" class="btn btn-sm btn-primary">
        Upload a document
      </router-link>
    </p>
  </div>
</template>

<style scoped>
.landing {
  width: 50%;
  margin: 6rem 0;
}

@media screen and (max-width: 991.5px) {
  .landing {
    width: 100%;
    margin: 0;
  }
}
</style>