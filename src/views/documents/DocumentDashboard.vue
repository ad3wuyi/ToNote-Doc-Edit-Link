<template>
  <div class="my-5 py-5 w-50 mx-auto">
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
