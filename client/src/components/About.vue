<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">About</h1>
        <p class="lead">Information about Uier</p>
      </div>
      <div class="card" id="about">
        <div class="card-body">
          <h2>Automated testing</h2>
          <div>The main purpose of Uier is to bring automated testing to a broader group. Historically, testing involved needing to ramp up a big QA effort in order to get some decent results. In more recent years, tools like Selenium have come up, but still much effort is required to learn the tooling, set up automated servers, create, execute, and interpreter test plans, and updating tests whenever the underlying assumptions change. The goal of Uiter is to make all of this effortless, by providing an open source solution that provides a visual experience.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {};
  }
};
</script>

<style scoped>
#about {
   width: 36rem;
   text-align: justify;
}
</style>