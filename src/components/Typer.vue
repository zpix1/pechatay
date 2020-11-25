<template>
  <h1>Typer</h1>
  <div>
    <div></div>
    <div contenteditable="true" class="typingplace"></div>
    
  </div>
</template>

<script>
export default {
  name: 'Typer',
  data: () => {
    return {
      'text': 'Привет, это тестирование набора текста.'
    }
  }
}
</script>

<style scoped>

.typingplace {
  border: 1px solid black;
}

</style>
