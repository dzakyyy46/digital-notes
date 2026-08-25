/* =========================================================
   STUDORA — LEARNING SPACE
   ========================================================= */


/* ================= SUBJECT DATA ================= */

const subjects = [
    {
        id: "pplg",
        name: "PPLG",
        icon: "P",
        description: "Pengembangan Perangkat Lunak dan Gim",
        color: "#e7f7ff",
        textColor: "#1597e5"
    },
    {
        id: "pipas",
        name: "PIPAS",
        icon: "P",
        description: "Projek Ilmu Pengetahuan Alam dan Sosial",
        color: "#eafbf4",
        textColor: "#32a879"
    },
    {
        id: "mtk",
        name: "Matematika",
        icon: "∑",
        description: "Konsep, rumus, dan pemecahan masalah",
        color: "#fff4d8",
        textColor: "#c59000"
    },
    {
        id: "sejarah",
        name: "Sejarah",
        icon: "S",
        description: "Peristiwa dan perkembangan sejarah",
        color: "#fff0e7",
        textColor: "#db7a39"
    },
    {
        id: "sunda",
        name: "B. Sunda",
        icon: "SU",
        description: "Bahasa dan budaya Sunda",
        color: "#eeeaff",
        textColor: "#7968e6"
    },
    {
        id: "inggris",
        name: "B. Inggris",
        icon: "EN",
        description: "English language and communication",
        color: "#e7f7ff",
        textColor: "#1597e5"
    },
    {
        id: "indo",
        name: "B. Indonesia",
        icon: "ID",
        description: "Bahasa dan sastra Indonesia",
        color: "#ffecee",
        textColor: "#df6975"
    },
    {
        id: "seni",
        name: "Seni Budaya",
        icon: "SB",
        description: "Seni rupa, musik, tari, dan teater",
        color: "#fff0f8",
        textColor: "#d65e9d"
    },
    {
        id: "pjok",
        name: "PJOK",
        icon: "PJ",
        description: "Pendidikan jasmani dan olahraga",
        color: "#e9fbf3",
        textColor: "#37ad7e"
    },
    {
        id: "pai",
        name: "PAI",
        icon: "PA",
        description: "Pendidikan Agama Islam",
        color: "#e9f7ff",
        textColor: "#168fca"
    },
    {
        id: "informatika",
        name: "Informatika",
        icon: "IF",
        description: "Teknologi informasi dan komputer",
        color: "#eeeaff",
        textColor: "#7867e4"
    },
    {
        id: "coding-ai",
        name: "Coding & AI",
        icon: "AI",
        description: "Pemrograman dan kecerdasan buatan",
        color: "#e7f7ff",
        textColor: "#1597e5"
    },
    {
        id: "ppkn",
        name: "PPKN",
        icon: "PK",
        description: "Pendidikan Pancasila dan kewarganegaraan",
        color: "#fff4d8",
        textColor: "#c59000"
    },
    {
        id: "literasi",
        name: "Literasi & Pengembangan Diri",
        icon: "L",
        description: "Kategori tambahan — dapat kamu ganti",
        color: "#fff0e7",
        textColor: "#db7a39"
    }
];


/* ================= LOCAL STORAGE ================= */

let notes = JSON.parse(localStorage.getItem("studora_notes")) || [];
let questions = JSON.parse(localStorage.getItem("studora_questions")) || [];
let flashcards = JSON.parse(localStorage.getItem("studora_flashcards")) || [];

let quizScore = Number(localStorage.getItem("studora_score")) || 0;
let currentSubject = null;
let currentQuestion = null;
let currentFlashIndex = 0;


/* ================= HELPERS ================= */

function saveData() {
    localStorage.setItem("studora_notes", JSON.stringify(notes));
    localStorage.setItem("studora_questions", JSON.stringify(questions));
    localStorage.setItem("studora_flashcards", JSON.stringify(flashcards));
    localStorage.setItem("studora_score", quizScore);
}

function getSubject(id) {
    return subjects.find(subject => subject.id === id);
}

function getSubjectName(id) {
    const subject = getSubject(id);
    return subject ? subject.name : "Tidak diketahui";
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.querySelector("p").textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* ================= NAVIGATION ================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    const activeNav = document.querySelector(
        `.nav-item[data-page="${pageId}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateStatistics();
}

window.showPage = showPage;


/* ================= RENDER SUBJECTS ================= */

function renderSubjects() {

    const dashboard = document.getElementById("dashboardSubjects");
    const allSubjects = document.getElementById("allSubjects");

    dashboard.innerHTML = "";
    allSubjects.innerHTML = "";

    subjects.forEach(subject => {

        const count = notes.filter(
            note => note.subject === subject.id
        ).length;

        const card = `
            <div
                class="subject-card"
                onclick="openSubject('${subject.id}')"
            >

                <span class="note-count">
                    ${count} catatan
                </span>

                <div
                    class="subject-icon"
                    style="
                        background:${subject.color};
                        color:${subject.textColor};
                    "
                >
                    ${subject.icon}
                </div>

                <h4>${subject.name}</h4>

                <p>
                    ${subject.description}
                </p>

            </div>
        `;

        dashboard.innerHTML += card;
        allSubjects.innerHTML += card;
    });
}


/* ================= SUBJECT DETAIL ================= */

function openSubject(subjectId) {

    currentSubject = subjectId;

    const subject = getSubject(subjectId);

    document.getElementById("detailTitle").textContent = subject.name;
    document.getElementById("detailIcon").textContent = subject.icon;
    document.getElementById("detailIcon").style.background = subject.color;
    document.getElementById("detailIcon").style.color = subject.textColor;

    document.getElementById("detailDescription").textContent =
        subject.description;

    document.getElementById("addNoteBtn").onclick = () => {
        openModal("noteModal");
    };

    document.getElementById("subjectQuizBtn").onclick = () => {
        showPage("questions");
        generateQuestion(subjectId);
    };

    document.getElementById("subjectFlashBtn").onclick = () => {
        showPage("flashcards");
        filterFlashcards(subjectId);
    };

    renderNotes();

    showPage("subjectDetail");
}

window.openSubject = openSubject;


/* ================= NOTES ================= */

function renderNotes() {

    const list = document.getElementById("notesList");
    const search = document
        .getElementById("noteSearch")
        .value
        .toLowerCase();

    const subjectNotes = notes
        .filter(note => note.subject === currentSubject)
        .filter(note =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );

    document.getElementById("notesCount").textContent =
        `${subjectNotes.length} catatan`;

    if (subjectNotes.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <div>📝</div>
                <h3>Belum ada catatan</h3>
                <p>
                    Tambahkan materi yang baru kamu pelajari.
                </p>
            </div>
        `;

        return;
    }

    list.innerHTML = subjectNotes
        .map(note => {

            const date = new Date(note.createdAt)
                .toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });

            return `
                <article class="note-card">

                    <div class="note-card-top">

                        <div>
                            <h4>${escapeHTML(note.title)}</h4>

                            <span class="note-date">
                                ${date}
                            </span>
                        </div>

                        <button
                            class="delete-btn"
                            onclick="deleteNote('${note.id}')"
                        >
                            ×
                        </button>

                    </div>

                    <p>
                        ${escapeHTML(note.content)}
                    </p>

                </article>
            `;

        })
        .join("");
}

function deleteNote(id) {

    if (!confirm("Hapus catatan ini?")) {
        return;
    }

    notes = notes.filter(note => note.id !== id);

    saveData();
    renderNotes();
    renderSubjects();
    updateStatistics();

    showToast("Catatan berhasil dihapus");
}

window.deleteNote = deleteNote;


/* ================= SAVE NOTE ================= */

document.getElementById("saveNote").addEventListener("click", () => {

    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (!title || !content) {
        showToast("Judul dan isi catatan harus diisi");
        return;
    }

    notes.unshift({
        id: crypto.randomUUID(),
        subject: currentSubject,
        title,
        content,
        createdAt: new Date().toISOString()
    });

    saveData();

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";

    closeModal("noteModal");

    renderNotes();
    renderSubjects();
    updateStatistics();

    showToast("Catatan berhasil disimpan");
});


document.getElementById("noteSearch")
    .addEventListener("input", renderNotes);


/* ================= QUESTIONS ================= */

function populateQuestionSubjects() {

    const select = document.getElementById("questionSubject");

    select.innerHTML = subjects
        .map(subject => `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `)
        .join("");
}

function generateQuestion(subjectId = null) {

    let available = questions;

    if (subjectId) {
        available = questions.filter(
            q => q.subject === subjectId
        );
    }

    if (available.length === 0) {

        currentQuestion = null;

        document.getElementById("quizQuestion").textContent =
            "Belum ada soal. Buat soal sendiri terlebih dahulu.";

        document.getElementById("quizOptions").innerHTML = "";

        return;
    }

    const randomIndex =
        Math.floor(Math.random() * available.length);

    currentQuestion = available[randomIndex];

    renderQuestion();
}

function renderQuestion() {

    if (!currentQuestion) {
        return;
    }

    document.getElementById("quizQuestion").textContent =
        currentQuestion.question;

    const options = document.getElementById("quizOptions");

    options.innerHTML = "";

    Object.entries(currentQuestion.options).forEach(
        ([key, value]) => {

            const button = document.createElement("button");

            button.className = "quiz-option";
            button.textContent = `${key}. ${value}`;

            button.onclick = () => answerQuestion(
                key,
                button
            );

            options.appendChild(button);
        }
    );
}

function answerQuestion(answer, clickedButton) {

    if (!currentQuestion) {
        return;
    }

    document
        .querySelectorAll(".quiz-option")
        .forEach(button => {
            button.disabled = true;
        });

    if (answer === currentQuestion.correct) {

        clickedButton.classList.add("correct");

        quizScore++;

        showToast("Jawaban benar! 🎉");

    } else {

        clickedButton.classList.add("wrong");

        document
            .querySelectorAll(".quiz-option")
            .forEach(button => {

                if (
                    button.textContent.startsWith(
                        currentQuestion.correct + "."
                    )
                ) {
                    button.classList.add("correct");
                }

            });

        showToast(
            `Jawaban yang benar adalah ${currentQuestion.correct}`
        );
    }

    saveData();
    updateStatistics();
}


/* ================= SAVE QUESTION ================= */

document.getElementById("saveQuestion")
    .addEventListener("click", () => {

        const subject =
            document.getElementById("questionSubject").value;

        const question =
            document.getElementById("questionText").value.trim();

        const A =
            document.getElementById("optionA").value.trim();

        const B =
            document.getElementById("optionB").value.trim();

        const C =
            document.getElementById("optionC").value.trim();

        const D =
            document.getElementById("optionD").value.trim();

        const correct =
            document.getElementById("correctAnswer").value;

        if (
            !question ||
            !A ||
            !B ||
            !C ||
            !D
        ) {
            showToast("Lengkapi semua data soal");
            return;
        }

        questions.push({
            id: crypto.randomUUID(),
            subject,
            question,
            options: {
                A,
                B,
                C,
                D
            },
            correct
        });

        saveData();

        document.getElementById("questionText").value = "";
        document.getElementById("optionA").value = "";
        document.getElementById("optionB").value = "";
        document.getElementById("optionC").value = "";
        document.getElementById("optionD").value = "";

        closeModal("questionModal");

        updateStatistics();

        generateQuestion();

        showToast("Soal berhasil dibuat");
    });


/* ================= FLASHCARDS ================= */

function populateFlashSubjects() {

    const select = document.getElementById("flashSubject");

    select.innerHTML = subjects
        .map(subject => `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `)
        .join("");
}

function renderFlashcards() {

    const list = document.getElementById("flashList");

    list.innerHTML = flashcards
        .map((flash, index) => `
            <div class="flash-list-item">

                <div>
                    <p>
                        ${escapeHTML(flash.front)}
                    </p>

                    <small>
                        ${getSubjectName(flash.subject)}
                    </small>
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteFlashcard(${index})"
                >
                    ×
                </button>

            </div>
        `)
        .join("");

    updateFlashcard();
}

function filterFlashcards(subjectId) {

    const filtered = flashcards.filter(
        flash => flash.subject === subjectId
    );

    if (filtered.length > 0) {
        currentFlashIndex = flashcards.indexOf(filtered[0]);
    }

    updateFlashcard();
}

function updateFlashcard() {

    const front = document.getElementById("flashFront");
    const back = document.getElementById("flashBack");
    const counter = document.getElementById("flashCounter");

    if (flashcards.length === 0) {

        front.textContent = "Belum ada flashcard";
        back.textContent = "-";
        counter.textContent = "0 / 0";

        return;
    }

    if (currentFlashIndex >= flashcards.length) {
        currentFlashIndex = 0;
    }

    const card = flashcards[currentFlashIndex];

    front.textContent = card.front;
    back.textContent = card.back;

    counter.textContent =
        `${currentFlashIndex + 1} / ${flashcards.length}`;

    document
        .getElementById("flashcard")
        .classList.remove("flipped");
}

function deleteFlashcard(index) {

    if (!confirm("Hapus flashcard ini?")) {
        return;
    }

    flashcards.splice(index, 1);

    if (currentFlashIndex >= flashcards.length) {
        currentFlashIndex = 0;
    }

    saveData();
    renderFlashcards();
    updateStatistics();

    showToast("Flashcard dihapus");
}


/* ================= SAVE FLASHCARD ================= */

document.getElementById("saveFlashcard")
    .addEventListener("click", () => {

        const subject =
            document.getElementById("flashSubject").value;

        const front =
            document
                .getElementById("flashFrontInput")
                .value
                .trim();

        const back =
            document
                .getElementById("flashBackInput")
                .value
                .trim();

        if (!front || !back) {
            showToast("Isi pertanyaan dan jawaban");
            return;
        }

        flashcards.push({
            id: crypto.randomUUID(),
            subject,
            front,
            back
        });

        saveData();

        document.getElementById("flashFrontInput").value = "";
        document.getElementById("flashBackInput").value = "";

        closeModal("flashModal");

        renderFlashcards();
        updateStatistics();

        showToast("Flashcard berhasil dibuat");
    });


document
    .getElementById("flashcard")
    .addEventListener("click", () => {

        document
            .getElementById("flashcard")
            .classList.toggle("flipped");

    });


document.getElementById("nextFlash")
    .addEventListener("click", () => {

        if (flashcards.length === 0) return;

        currentFlashIndex++;

        if (currentFlashIndex >= flashcards.length) {
            currentFlashIndex = 0;
        }

        updateFlashcard();

    });


document.getElementById("previousFlash")
    .addEventListener("click", () => {

        if (flashcards.length === 0) return;

        currentFlashIndex--;

        if (currentFlashIndex < 0) {
            currentFlashIndex = flashcards.length - 1;
        }

        updateFlashcard();

    });


/* ================= AI STUDY BUDDY ================= */

const aiInput = document.getElementById("aiInput");
const sendAi = document.getElementById("sendAi");

function addChatMessage(message, type = "bot") {

    const chat = document.getElementById("aiChat");

    const div = document.createElement("div");

    div.className = `chat-message ${type}`;

    div.innerHTML = `
        <div class="chat-avatar">
            ${type === "bot" ? "✦" : "D"}
        </div>

        <div class="message">
            <strong>
                ${type === "bot" ? "Study Buddy" : "Kamu"}
            </strong>

            <p>${escapeHTML(message)}</p>
        </div>
    `;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

function aiAnswer(question) {

    const q = question.toLowerCase();

    const relevantNotes = notes
        .filter(note => {

            const text =
                `${note.title} ${note.content}`.toLowerCase();

            return q
                .split(" ")
                .some(word =>
                    word.length > 3 &&
                    text.includes(word)
                );

        })
        .slice(0, 3);

    if (relevantNotes.length > 0) {

        let answer =
            "Aku menemukan materi yang berhubungan dengan pertanyaanmu:\n\n";

        relevantNotes.forEach(note => {

            answer +=
                `• ${note.title}: ${note.content.slice(0, 350)}\n\n`;

        });

        answer +=
            "Coba gunakan poin tersebut sebagai dasar untuk memahami materi.";

        return answer;
    }


    if (
        q.includes("variabel") &&
        (
            q.includes("coding") ||
            q.includes("program") ||
            q.includes("javascript")
        )
    ) {

        return `
Variabel adalah tempat untuk menyimpan sebuah nilai dalam program.

Contoh sederhana:

let nama = "Dzaky";

Di sini:
• nama = nama variabel
• "Dzaky" = nilai

Variabel dapat digunakan kembali dan nilainya dapat berubah selama program berjalan.
        `;
    }


    if (
        q.includes("html")
    ) {

        return `
HTML adalah bahasa markup yang digunakan untuk menyusun struktur halaman web.

Contohnya:
• heading
• paragraf
• gambar
• tombol
• form

HTML bukan bahasa pemrograman. HTML digunakan untuk struktur, sedangkan CSS mengatur tampilan dan JavaScript menambahkan interaksi.
        `;
    }


    if (
        q.includes("css")
    ) {

        return `
CSS digunakan untuk mengatur tampilan halaman web.

Dengan CSS kamu bisa mengatur:
• warna
• ukuran
• layout
• jarak
• font
• animasi
• responsive design

Jadi mudahnya: HTML = struktur, CSS = tampilan.
        `;
    }


    if (
        q.includes("javascript") ||
        q.includes("js")
    ) {

        return `
JavaScript adalah bahasa pemrograman yang banyak digunakan untuk membuat website menjadi interaktif.

Contohnya:
• tombol yang dapat diklik
• modal
• validasi form
• quiz
• manipulasi DOM
• mengambil data dari API
        `;
    }


    if (
        q.includes("belajar") ||
        q.includes("cara memahami")
    ) {

        return `
Coba gunakan metode 4 langkah:

1. Baca konsep dasarnya.
2. Jelaskan kembali menggunakan kata-katamu sendiri.
3. Buat contoh.
4. Kerjakan soal tanpa melihat catatan.

Kalau masih salah, kembali ke bagian konsep yang belum kamu pahami.
        `;
    }


    return `
Aku belum menemukan jawaban spesifik dari catatanmu.

Coba tuliskan:
• nama materi
• konsep yang tidak kamu pahami
• contoh soal

Semakin jelas pertanyaanmu, semakin mudah materi tersebut dijelaskan.

Kamu juga bisa menambahkan materi tersebut ke Catatan supaya Study Buddy dapat menggunakannya.
    `;
}

function sendAIMessage() {

    const message = aiInput.value.trim();

    if (!message) {
        return;
    }

    addChatMessage(message, "user");

    aiInput.value = "";

    setTimeout(() => {

        const answer = aiAnswer(message);

        addChatMessage(answer, "bot");

    }, 450);
}

sendAi.addEventListener("click", sendAIMessage);

aiInput.addEventListener("keydown", event => {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendAIMessage();
    }

});


document
    .querySelectorAll(".ai-suggestions button")
    .forEach(button => {

        button.addEventListener("click", () => {

            aiInput.value =
                button.dataset.question;

            sendAIMessage();

        });

    });


/* ================= MODALS ================= */

function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

document
    .querySelectorAll(".modal-close")
    .forEach(button => {

        button.addEventListener("click", () => {

            closeModal(
                button.dataset.close
            );

        });

    });

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("show");
            }

        });

    });


document
    .getElementById("createQuestionBtn")
    .addEventListener("click", () => {
        openModal("questionModal");
    });


document
    .getElementById("createQuestionBtn2")
    .addEventListener("click", () => {
        openModal("questionModal");
    });


document
    .getElementById("createFlashcardBtn")
    .addEventListener("click", () => {
        openModal("flashModal");
    });


/* ================= RANDOM QUIZ ================= */

document
    .getElementById("randomQuestionBtn")
    .addEventListener("click", () => {

        generateQuestion();

    });


document
    .getElementById("nextQuestionBtn")
    .addEventListener("click", () => {

        generateQuestion();

    });


/* ================= NAV BUTTONS ================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener("click", () => {

            showPage(button.dataset.page);

        });

    });


/* ================= SEARCH ================= */

document
    .getElementById("globalSearch")
    .addEventListener("keydown", event => {

        if (event.key !== "Enter") {
            return;
        }

        const search = event.target.value
            .trim()
            .toLowerCase();

        if (!search) {
            return;
        }

        const foundNote = notes.find(note =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );

        if (foundNote) {

            openSubject(foundNote.subject);

            document.getElementById("noteSearch").value =
                search;

            renderNotes();

            return;
        }

        const foundSubject = subjects.find(subject =>
            subject.name.toLowerCase().includes(search)
        );

        if (foundSubject) {

            openSubject(foundSubject.id);

            return;
        }

        showToast("Tidak ditemukan");
    });


/* ================= MOBILE MENU ================= */

document
    .getElementById("mobileMenu")
    .addEventListener("click", () => {

        document
            .querySelector(".sidebar")
            .classList.toggle("open");

    });


/* ================= THEME ================= */

function setDarkMode(enabled) {

    document.body.classList.toggle(
        "dark",
        enabled
    );

    localStorage.setItem(
        "studora_dark",
        enabled
    );

    document.getElementById("darkMode").checked =
        enabled;
}

const savedDark =
    localStorage.getItem("studora_dark") === "true";

setDarkMode(savedDark);

document
    .getElementById("darkMode")
    .addEventListener("change", event => {

        setDarkMode(
            event.target.checked
        );

    });


document
    .getElementById("themeButton")
    .addEventListener("click", () => {

        const current =
            document.body.classList.contains("dark");

        setDarkMode(!current);

    });


/* ================= RESET ================= */

document
    .getElementById("clearData")
    .addEventListener("click", () => {

        const confirmReset =
            confirm(
                "Yakin ingin menghapus semua data STUDORA?"
            );

        if (!confirmReset) {
            return;
        }

        notes = [];
        questions = [];
        flashcards = [];
        quizScore = 0;

        saveData();

        renderSubjects();
        renderNotes();
        renderFlashcards();
        updateStatistics();

        showToast("Semua data berhasil dihapus");

    });


/* ================= STATISTICS ================= */

function updateStatistics() {

    document.getElementById("totalNotes")
        .textContent = notes.length;

    document.getElementById("totalQuestions")
        .textContent = questions.length;

    document.getElementById("totalFlashcards")
        .textContent = flashcards.length;

    document.getElementById("statNotes")
        .textContent = notes.length;

    document.getElementById("statQuestions")
        .textContent = questions.length;

    document.getElementById("statFlashcards")
        .textContent = flashcards.length;

    document.getElementById("statScore")
        .textContent = quizScore;

    document.getElementById("quizScore")
        .textContent = `Skor: ${quizScore}`;

    const progress =
        questions.length
            ? Math.min(
                100,
                (quizScore / questions.length) * 100
            )
            : 0;

    document.getElementById("quizProgress")
        .style.width = `${progress}%`;

    const progressList =
        document.getElementById("progressList");

    progressList.innerHTML = subjects
        .map(subject => {

            const count =
                notes.filter(
                    note =>
                        note.subject === subject.id
                ).length;

            const percentage =
                Math.min(
                    100,
                    count * 20
                );

            return `
                <div class="progress-row">

                    <span>
                        ${subject.name}
                    </span>

                    <div class="bar">
                        <div
                            style="width:${percentage}%"
                        ></div>
                    </div>

                    <small>
                        ${count}
                    </small>

                </div>
            `;

        })
        .join("");
}


/* ================= STREAK ================= */

function updateStreak() {

    const today =
        new Date().toISOString().slice(0, 10);

    const previous =
        localStorage.getItem("studora_last_study");

    let streak =
        Number(
            localStorage.getItem("studora_streak")
        ) || 0;

    if (previous !== today) {

        if (previous) {

            const previousDate =
                new Date(previous);

            const currentDate =
                new Date(today);

            const diff =
                Math.floor(
                    (
                        currentDate -
                        previousDate
                    ) /
                    (1000 * 60 * 60 * 24)
                );

            if (diff === 1) {
                streak++;
            } else if (diff > 1) {
                streak = 1;
            }

        } else {
            streak = 1;
        }

        localStorage.setItem(
            "studora_last_study",
            today
        );

        localStorage.setItem(
            "studora_streak",
            streak
        );
    }

    document.getElementById("streakText")
        .textContent = `${streak} Hari`;
}


/* ================= SECURITY HELPER ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= INITIALIZATION ================= */

populateQuestionSubjects();
populateFlashSubjects();

renderSubjects();
renderFlashcards();

updateStatistics();
updateStreak();

generateQuestion();


/* ================= DEMO DATA ================= */

/*
   Tidak otomatis memasukkan demo data agar
   website langsung bersih ketika pertama kali dibuka.

   Kalau ingin contoh soal bawaan, hapus komentar
   pada fungsi addDemoQuestions().
*/

function addDemoQuestions() {

    questions.push(
        {
            id: crypto.randomUUID(),
            subject: "coding-ai",
            question: "Apa fungsi utama CSS pada website?",
            options: {
                A: "Menyimpan database",
                B: "Mengatur tampilan website",
                C: "Mengirim email",
                D: "Membuat server"
            },
            correct: "B"
        },

        {
            id: crypto.randomUUID(),
            subject: "pplg",
            question: "Apa yang dimaksud dengan algoritma?",
            options: {
                A: "Kumpulan langkah sistematis untuk menyelesaikan masalah",
                B: "Jenis perangkat keras",
                C: "Bahasa markup",
                D: "Sistem operasi"
            },
            correct: "A"
        },

        {
            id: crypto.randomUUID(),
            subject: "informatika",
            question: "Apa kepanjangan dari CPU?",
            options: {
                A: "Central Processing Unit",
                B: "Computer Program Utility",
                C: "Central Program User",
                D: "Computer Processing Utility"
            },
            correct: "A"
        }
    );

    saveData();
}