<!--
 tits-mp - Management page for unofficial TIT&S website (github.com/WeebDeveloperz/titsunofficial)
 Copyright (C) 2023  titsunofficial contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<script>
  import { fade } from 'svelte/transition';
  import FileEditor from "../../components/FileEditor.svelte";
  import { File } from "../../classes.js";

  // NOTE: this function does absolutely nothing and
  // for now that is intentional. please don't exile me
  const filterFiles = (files, searchString) => files;

  // TODO: optionally filter by branch
  //const filterSubjects = (subjects, searchString) => [...new Set([
  //  ...subjects.filter(i => i.code.toLowerCase().includes(searchString.toLowerCase())),
  //  ...subjects.filter(i => i.name.toLowerCase().includes(searchString.toLowerCase())),
  //])];

  let files = [];
  const loadFiles = () =>
    fetch('http://localhost:6969/files')
      .then(response => response.json())
      .then(data => files = data.data);
  loadFiles();

  let searchString = "";
  let showEditor = false;
  let editorFile = new File();

  const handleAddNew = () => {
    showEditor = true;
    editorFile = new File();
  }

  const handleCancel = () => {
    showEditor = false;
    editorFile = new File();
  }

  const handleUpdate = () => {
    loadFiles();
    handleCancel();
  }
</script>

<div class="searchbox">
  Search Files (disabled temporarily) <input bind:value={searchString}/>
</div>

{#key files}
<table in:fade="{{ duration: 200, delay: 100 }}" out:fade="{{ duration: 300, delay: 0 }}">
  <tr>
    <th>File Name</th>
    <button on:click={handleAddNew}>Add New</button>
  </tr>
  {#if files != null}
    {#each filterFiles(files, searchString) as f}
      <tr>
        <td>{f.name}</td>
        <button on:click={() => {showEditor = true; editorFile = f}}>
          Edit
        </button>
      </tr>
    {:else}
      <h1>No Files With This Name Found.</h1>
    {/each}
  {:else}
    <h1>No Files Exist In The Database.</h1>
  {/if}
</table>
{/key}

{#if showEditor}
<div class="editor-parent" in:fade="{{ duration: 150 }}" out:fade="{{ duration: 200 }}">
  <FileEditor file={editorFile} on:files-updated={handleUpdate} on:edit-canceled={handleCancel}/>
</div>
{/if}

<style>
  button {
    width: 7rem;
  }
  .searchbox {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }
  .searchbox input {
    margin-left: 1rem;
  }
  table {
    width: 80%;
    margin: auto;
  }
  th, td {
    text-align: left;
    border-bottom: 1px solid black;
  }
  .editor-parent {
    z-index: 10;
    background-color: white;
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    margin: auto;
    border: 1px solid black;
    height: 40vh;
    width: 60vw;
    box-shadow: 0.1rem 0.1rem 0.3rem 0.05rem rgba(35, 38, 39, 0.7);
  }
</style>
