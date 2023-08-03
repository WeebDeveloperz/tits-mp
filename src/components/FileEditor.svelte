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
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let file = null;
  let storedPassword = sessionStorage.getItem("password")
  let password = storedPassword ? storedPassword : "";
  let fObject = null;

  let noticeText = ""
  const validate = (file) => {
    if (file.name == "")
      return "Please enter a file name";
    if (fObject == null)
      return "No file uploaded";
    return "";
  }

  const handleSave = async(method) => {
    noticeText = validate(file);
    if (noticeText != "" && method !== "delete") return;
    noticeText = password == "" ? "Password Can't Be Blank." : ""
    noticeText = method === "put" ? "File updation is disabled. Please delete file and upload again." : "";
    if (noticeText != "") return;

    const data = new FormData();
    data.append("data", JSON.stringify(file));
    data.append("file", fObject)
    data.append("passwd", password);

    const res = await fetch("http://localhost:6969/files", {
      method: method,
      body: data
    })
      .then(response => response.json())
      .then(r => {
        if (r.error == "Incorrect Password.") {
          noticeText = "Incorrect Password."
        } else {
          dispatch("files-updated", {});
        }
      });
  }

  const handleCancel = () =>
    dispatch("edit-canceled", {})
</script>


<div class="file-editor">
  <h4 class="notice warning">{noticeText}</h4>
  <div class="fields">
    <div class="field">
      File Name:
      <input bind:value={file.name} placeholder="File Name">
    </div>
    <div class="field">
      Upload File:
      <input type="file" accept=".pdf" on:change={e => fObject = e.target.files[0]}>
    </div>
  </div>
  {#if file.id != null}
    <div class="options-alt">
      <button on:click={() => handleSave("delete")}>Delete</button>
    </div>
  {/if}
  <div class="options">
    <input bind:value={password} placeholder="Enter the password here.">
    <button on:click={handleCancel}>Cancel</button>
    <button on:click={e => handleSave(file.id == null ? "post" : "put")}>Save</button>
  </div>
</div>

<style>
  .file-editor {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .options-alt {
    position: absolute;
    bottom: 3rem;
    left: 4rem;
    display: flex;
    width: 12rem;
    justify-content: space-between;
  }
  .options {
    position: absolute;
    bottom: 3rem;
    right: 4rem;
    display: flex;
    width: 32rem;
    justify-content: space-between;
  }
  button {
    width: 5rem;
  }
  .field {
    width: 30rem;
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
  }
  .field input, .field select {
    width: 60%;
  }
  .warning {
    color: red;
  }
  .notice {
    position: absolute;
    top: 2rem;
    left: 0; right: 0;
    margin: auto;
    text-align: center;
  }
</style>
