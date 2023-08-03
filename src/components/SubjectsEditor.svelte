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

  export let subject = null;
  let storedPassword = sessionStorage.getItem("password")
  let password = storedPassword ? storedPassword : "";

  let noticeText = ""
  const validate = (subject) => {
    //if (subject.DisplayName == "")
    //  return "Display Name Can't Be Blank.";
    return "";
  }

  const handleSave = async(method) => {
    noticeText = validate(subject);
    if (noticeText != "" && method !== "delete") return;
    noticeText = password == "" ? "Password Can't Be Blank." : ""
    if (noticeText != "") return;

    subject.sem = parseInt(subject.sem)
    const data = new FormData();
    data.append("data", JSON.stringify(subject));
    data.append("passwd", password);

    const res = await fetch("http://localhost:6969/subjects", {
      method: method,
      body: data
    })
      .then(response => response.json())
      .then(data => {
        if (data.error == "Incorrect Password.") {
          noticeText = "Incorrect Password."
        } else {
          dispatch("subjects-updated", {});
        }
      });
  }

  const handleCancel = () =>
    dispatch("edit-canceled", {})
</script>


<div class="subject-editor">
  <h4 class="notice warning">{noticeText}</h4>
  <div class="fields">
    <div class="field">
      Branch:
      <input bind:value={subject.branch} placeholder="Branch">
    </div>
    <div class="field">
      Semester:
      <input bind:value={subject.sem} placeholder="Semester" type="number">
    </div>
    <div class="field">
      Subject Name:
      <input bind:value={subject.name} placeholder="Subject Name">
    </div>
    <div class="field">
      Subject Code:
      <input bind:value={subject.code} placeholder="Subject Code">
    </div>
  </div>
  {#if subject.id != null}
    <div class="options-alt">
      <button on:click={() => handleSave("delete")}>Delete</button>
    </div>
  {/if}
  <div class="options">
    <input bind:value={password} placeholder="Enter the password here.">
    <button on:click={handleCancel}>Cancel</button>
    <button on:click={() => handleSave(subject.id == null ? "post" : "put")}>Save</button>
  </div>
</div>

<style>
  .subject-editor {
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
  .field input {
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
