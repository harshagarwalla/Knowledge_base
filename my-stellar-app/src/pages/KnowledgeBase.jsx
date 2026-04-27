import React, { useState, useRef, useEffect } from "react";
import { checkConnection, createArticle, editArticle, upvoteArticle, markAnswer, archiveArticle, getArticle, listArticles, getArticleCount } from "../../lib/stellar.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wallet, PenTool, Edit3, Search, Activity, Archive, CheckCircle } from "lucide-react";

gsap.registerPlugin(useGSAP);

const toOutput = (value) => {
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
};

const truncateAddress = (addr) => {
    if (!addr || addr.length < 12) return addr;
    return addr.slice(0, 6) + "..." + addr.slice(-4);
};

export default function KnowledgeBase() {
    const container = useRef();
    
    // Original state logic
    const [form, setForm] = useState({
        id: "article1",
        author: "",
        title: "Getting Started with Soroban",
        content: "Soroban is a smart contracts platform...",
        category: "tutorial",
        tags: "soroban,stellar,rust",
        editor: "",
        newContent: "",
        voter: "",
    });
    const [output, setOutput] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [countValue, setCountValue] = useState("-");
    const [loadingAction, setLoadingAction] = useState(null);
    const [status, setStatus] = useState("idle");
    const [activeTab, setActiveTab] = useState(0);
    const [connectedAddress, setConnectedAddress] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const confirmTimer = useRef(null);

    useEffect(() => {
        return () => { if (confirmTimer.current) clearTimeout(confirmTimer.current); };
    }, []);

    // GSAP Animations
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.kb-header', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.out' })
          .from('.kb-wallet-bar', { scale: 0.95, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, "-=0.3")
          .from('.tab-bar', { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
          .from('.tab-content-anim .glass-card, .result-card', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, "-=0.1");
    }, { scope: container });

    // Animate tab changes
    useGSAP(() => {
        gsap.fromTo('.tab-content-anim', 
            { opacity: 0, y: 20, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
    }, [activeTab]);

    const setField = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const runAction = async (actionName, action) => {
        setIsBusy(true);
        setLoadingAction(actionName);
        setStatus("idle");
        try {
            const result = await action();
            setOutput(toOutput(result ?? "No data found"));
            setStatus("success");
            
            // Output pop animation
            gsap.fromTo('.output-pre', { scale: 0.98, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.3 });
            
        } catch (error) {
            setOutput(error?.message || String(error));
            setStatus("error");
            
            // Error shake animation
            gsap.fromTo('.output-pre', 
                { x: -5 }, { x: 5, duration: 0.1, yoyo: true, repeat: 3, onComplete: () => gsap.set('.output-pre', {x: 0}) }
            );
        } finally {
            setIsBusy(false);
            setLoadingAction(null);
        }
    };

    const handleConfirm = (actionName, action) => {
        if (confirmAction === actionName) {
            setConfirmAction(null);
            if (confirmTimer.current) clearTimeout(confirmTimer.current);
            action();
        } else {
            setConfirmAction(actionName);
            if (confirmTimer.current) clearTimeout(confirmTimer.current);
            confirmTimer.current = setTimeout(() => setConfirmAction(null), 3000);
        }
    };

    const onConnect = () => runAction("connect", async () => {
        const user = await checkConnection();
        if (user) {
            setConnectedAddress(user.publicKey);
            setForm((prev) => ({
                ...prev, author: prev.author || user.publicKey, editor: prev.editor || user.publicKey, voter: prev.voter || user.publicKey
            }));
        }
        return user ? `Connected: ${user.publicKey}` : "Wallet: not connected";
    });

    const onCreateArticle = () => runAction("createArticle", async () => createArticle({
        id: form.id.trim(), author: form.author.trim(), title: form.title.trim(), content: form.content.trim(), category: form.category.trim(), tags: form.tags.trim(),
    }));

    const onEditArticle = () => runAction("editArticle", async () => editArticle({
        id: form.id.trim(), editor: form.editor.trim() || form.author.trim(), newContent: form.newContent.trim(),
    }));

    const onUpvote = () => runAction("upvote", async () => upvoteArticle({
        id: form.id.trim(), voter: form.voter.trim() || form.author.trim(),
    }));

    const onMarkAnswer = () => runAction("markAnswer", async () => markAnswer({
        id: form.id.trim(), author: form.author.trim(),
    }));

    const onArchive = () => handleConfirm("archive", () => runAction("archive", async () => archiveArticle({
        id: form.id.trim(), author: form.author.trim(),
    })));

    const onGetArticle = () => runAction("getArticle", async () => getArticle(form.id.trim()));
    const onList = () => runAction("list", async () => listArticles());
    const onCount = () => runAction("count", async () => {
        const value = await getArticleCount();
        setCountValue(String(value));
        return { count: value };
    });

    const tabs = [
        { name: "Write Article", icon: <PenTool size={18} /> },
        { name: "Edit & Collaborate", icon: <Edit3 size={18} /> },
        { name: "Browse", icon: <Search size={18} /> }
    ];

    return (
        <div className="container" ref={container}>
            <div className="kb-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', background: 'linear-gradient(to right, #fff, var(--w3-text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Knowledge Base</h1>
                    <p style={{ color: 'var(--w3-text-muted)' }}>Stellar Soroban Project 29</p>
                </div>
                {connectedAddress && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--w3-glass)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--w3-glass-border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--w3-success)' }}></div>
                        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{truncateAddress(connectedAddress)}</span>
                    </div>
                )}
            </div>

            <div className="glass-card kb-wallet-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button className="btn-primary" onClick={onConnect} disabled={isBusy} style={{ padding: '0.85rem 1.5rem', fontSize: '1rem', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>
                        <Wallet size={20} /> {loadingAction === "connect" ? "Connecting..." : "Connect Freighter"}
                    </button>
                    {!connectedAddress && <span style={{ color: 'var(--w3-text-main)', fontSize: '0.95rem', fontWeight: 500 }}>Please connect your Freighter wallet to interact securely.</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--w3-text-muted)', fontSize: '0.9rem' }}>
                    <Activity size={18} color="var(--w3-primary)" /> Articles: <strong style={{ color: '#fff' }}>{countValue}</strong>
                </div>
            </div>

            <div className="tab-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {tabs.map((tab, i) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(i)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            flex: 1, padding: '0.75rem', borderRadius: 'var(--w3-radius)',
                            background: activeTab === i ? 'rgba(6, 182, 212, 0.15)' : 'var(--w3-glass)',
                            color: activeTab === i ? 'var(--w3-primary)' : 'var(--w3-text-muted)',
                            border: `1px solid ${activeTab === i ? 'rgba(6, 182, 212, 0.3)' : 'var(--w3-glass-border)'}`,
                            cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s'
                        }}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            <div className="tab-content-anim">
                {activeTab === 0 && (
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}><PenTool size={20} color="var(--w3-primary)" /> Write New Article</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="field">
                                <label>Article ID (Symbol)</label>
                                <input name="id" value={form.id} onChange={setField} />
                            </div>
                            <div className="field">
                                <label>Author Address</label>
                                <input name="author" value={form.author} onChange={setField} placeholder="G..." />
                            </div>
                            <div className="field" style={{ gridColumn: '1 / -1' }}>
                                <label>Title</label>
                                <input name="title" value={form.title} onChange={setField} />
                            </div>
                            <div className="field" style={{ gridColumn: '1 / -1' }}>
                                <label>Content</label>
                                <textarea name="content" rows="4" value={form.content} onChange={setField} />
                            </div>
                            <div className="field">
                                <label>Category (Symbol)</label>
                                <input name="category" value={form.category} onChange={setField} />
                            </div>
                            <div className="field">
                                <label>Tags (comma-separated)</label>
                                <input name="tags" value={form.tags} onChange={setField} />
                            </div>
                        </div>
                        <button className="btn-primary" onClick={onCreateArticle} disabled={isBusy} style={{ marginTop: '1rem' }}>
                            {loadingAction === "createArticle" ? "Publishing..." : "Publish Article"}
                        </button>
                    </div>
                )}

                {activeTab === 1 && (
                    <>
                        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}><Edit3 size={20} color="var(--w3-secondary)" /> Edit Content</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="field">
                                    <label>Editor Address</label>
                                    <input name="editor" value={form.editor} onChange={setField} placeholder="G..." />
                                </div>
                                <div className="field">
                                    <label>Voter Address</label>
                                    <input name="voter" value={form.voter} onChange={setField} placeholder="G..." />
                                </div>
                                <div className="field" style={{ gridColumn: '1 / -1' }}>
                                    <label>New Content</label>
                                    <textarea name="newContent" rows="3" value={form.newContent} onChange={setField} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn-primary" onClick={onEditArticle} disabled={isBusy}>{loadingAction === "editArticle" ? "Updating..." : "Update Article"}</button>
                                <button className="btn-secondary" onClick={onUpvote} disabled={isBusy}>{loadingAction === "upvote" ? "Upvoting..." : "Upvote"}</button>
                            </div>
                        </div>
                        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}><CheckCircle size={20} color="var(--w3-success)" /> Curation Actions</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" onClick={onMarkAnswer} disabled={isBusy}>{loadingAction === "markAnswer" ? "Processing..." : "Mark as Answer"}</button>
                                <button className="btn-danger" onClick={onArchive} disabled={isBusy}>
                                    <Archive size={16} /> {confirmAction === "archive" ? "Confirm Archive?" : "Archive Article"}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 2 && (
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}><Search size={20} color="var(--w3-accent)" /> Browse Data</h2>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-ghost" onClick={onGetArticle} disabled={isBusy}>{loadingAction === "getArticle" ? "Loading..." : "Get Article Info"}</button>
                            <button className="btn-ghost" onClick={onList} disabled={isBusy}>{loadingAction === "list" ? "Loading..." : "List All Articles"}</button>
                            <button className="btn-ghost" onClick={onCount} disabled={isBusy}>{loadingAction === "count" ? "Loading..." : "Refresh Count"}</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-card result-card">
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--w3-text-muted)' }}>Transaction Output</h2>
                <pre className={`output-pre status-${status}`}>
                    {output || "Connect your wallet and interact with the contract. Results will show here."}
                </pre>
            </div>
        </div>
    );
}
