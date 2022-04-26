const toastList = document.querySelector(".toastList");

export const showToast = (isChangeSavedInDB) => {
  const id = Date.now();
  const toast = document.createElement("li");
  toast.setAttribute("class", "toast");
  toast.setAttribute("id", `toast_${id}`);
  if (isChangeSavedInDB) {
    toast.classList.add("toast-success");
    toast.textContent = "\u2713 Changes are saved successfully";
  }
  else {
    toast.classList.add("toast-fail");
    toast.textContent = "We couldn't save your changes";
  }
  toast.classList.add("animate-toast");
  toastList.appendChild(toast);
  
  removeToast(id, 2000);
}

export const removeToast = (id, delay) => {
  setTimeout(() => {
    const toast = document.getElementById(`toast_${id}`);
    toastList.removeChild(toast);
  }, delay);
}