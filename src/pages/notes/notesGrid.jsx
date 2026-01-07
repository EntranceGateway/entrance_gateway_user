import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotesByCourse } from "../../http/notes";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Pagination from "../../components/Pagination/pagination";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";

import NoteCard from "../../components/common/NoteCard/NoteCard";
import NotesSkeleton from "../../components/common/NoteCard/NotesSkeleton";
import EmptyState from "../../components/common/NoteCard/EmptyState";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function NotesGrid() {
  const { course, sem } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getNotesByCourse(course, sem, token);
        setNotes(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    if (course && sem) fetchNotes();
  }, [course, sem]);

  const totalPages = useMemo(() => Math.ceil(notes.length / DEFAULT_PAGE_SIZE), [notes.length]);
  const paginated = useMemo(
    () => notes.slice((currentPage - 1) * DEFAULT_PAGE_SIZE, currentPage * DEFAULT_PAGE_SIZE),
    [notes, currentPage]
  );

  // Correctly handle the note ID
  const handleCardClick = (note) => {
    // Use whichever key exists: id, _id, or noteId
    const noteId = note.id || note._id || note.noteId;
    if (!noteId) {
      console.error("Note ID is missing", note);
      return;
    }
    navigate(`/note/${noteId}`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-4 group"
          >
            <ArrowLeft
              size={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Courses
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-gray-200">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {course}
              </h1>
              <p className="text-lg text-gray-500 mt-2 font-medium">
                Semester {sem} Resources
              </p>
            </div>
            {!loading && (
              <span className="mt-4 md:mt-0 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                {notes.length} {notes.length === 1 ? "Note" : "Notes"} Available
              </span>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <NotesSkeleton />
          ) : notes.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paginated.map((note, index) => (
                  <NoteCard
                    key={note.id || note._id || note.noteId || index}
                    note={note}
                    index={index}
                    onClick={() => handleCardClick(note)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={currentPage}
                totalItems={notes.length}
                pageSize={DEFAULT_PAGE_SIZE}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDisabled={loading}
                showPageInfo={true}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
