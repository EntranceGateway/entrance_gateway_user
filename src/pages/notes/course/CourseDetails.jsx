import { useParams, useEffect, useState } from "react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`http://185.177.116.173:8080/api/v1/courses/${id}`)
      .then(res => res.json())
      .then(json => setCourse(json?.data));
  }, [id]);

  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold">{course.courseName}</h1>
      <p>{course.description}</p>
    </div>
  );
}
