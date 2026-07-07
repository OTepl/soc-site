const currentUser = JSON.parse(localStorage.getItem('user'));

if (!currentUser && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('register.html')) {
    window.location.href = 'index.html';
}

if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const age = document.getElementById('age').value;
        if (age < 13) return alert("Must be 13+");

        const body = {
            firstName: document.getElementById('fName').value,
            lastName: document.getElementById('lName').value,
            age: age,
            username: document.getElementById('user').value,
            password: document.getElementById('pass').value
        };

        const res = await fetch('/api/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
        if (res.ok) { alert("Done!"); window.location.href = 'index.html'; }
    });
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = { username: document.getElementById('user').value, password: document.getElementById('pass').value };
        const res = await fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'feed.html';
        } else { alert("Wrong credentials"); }
    });
}

function logout() { localStorage.clear(); window.location.href = 'index.html'; }

async function createPost() {
    const body = {
        author_id: currentUser.id,
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value
    };
    await fetch('/api/posts', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
    location.reload();
}

if (document.getElementById('postsFeed')) {
    fetch('/api/posts').then(r => r.json()).then(posts => {
        const feed = document.getElementById('postsFeed');
        posts.forEach(p => {
            feed.innerHTML += `
                <div class="card post">
                    <h3>${p.title}</h3>
                    <p>${p.content}</p>
                    <small>By ${p.first_name} ${p.last_name} on ${new Date(p.created_at).toLocaleString()}</small>
                </div>`;
        });
    });
}