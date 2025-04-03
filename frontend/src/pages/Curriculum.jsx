import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Curriculum = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [curriculumData, setCurriculumData] = useState({
    title: 'KURIKULUM SEKOLAH DASAR ISLAM TERPADU DI DARUSSALAM BATAM',
    lastUpdated: 'July 16, 2019',
    updatedBy: 'admin',
    sections: [
      {
        id: 1,
        title: 'Kerangka Dasar dan Struktur Kurikulum',
        content: 'Kurikulum diartikan sebagai seperangkat rencana dan pengaturan mengenai tujuan, isi, dan bahan pelajaran serta cara yang digunakan sebagai pedoman penyelenggaraan kegiatan pembelajaran untuk mencapai tujuan pendidikan tertentu. Berdasarkan pengertian tersebut, ada dua dimensi kurikulum, yang pertama adalah rencana dan pengaturan mengenai tujuan, isi, dan bahan pelajaran, sedangkan yang kedua adalah cara yang digunakan untuk kegiatan pembelajaran. SD IT Darussalam Di Batam Menggunakan Kurikulum 2013. Kurikulum 2013 adalah kurikulum perencanaan yang disusun oleh dan di laksanakan di masing – masing satuan pendidikan. Penyusunan KTSP dilakukan oleh satuan pendidikan dengan memperhatikan standar kompetensi lulusan, standar isi, standar pendidikan, kalender pendidikan dan silabus.'
      },
      {
        id: 2,
        title: 'Komponen Kurikulum',
        content: '',
        subsections: [
          {
            id: 21,
            title: 'Landasan Filosofis',
            content: 'Landasan filosofis pengembangan kurikulum menentukan kualitas peserta didik yang akan dicapai kurikulum, sumber dan isi dari kurikulum, proses pembelajaran, posisi peserta didik, penilaian hasil belajar, hubungan peserta didik dengan masyarakat dan lingkungan alam di sekitarnya.'
          },
          {
            id: 22,
            title: 'Landasan Teoritis',
            content: 'Kurikulum 2013 dikembangkan atas teori "pendidikan berdasarkan standar" (standard-based education), dan teori kurikulum berbasis kompetensi (competency-based curriculum).'
          },
          {
            id: 23,
            title: 'Landasan Yuridis',
            content: 'Landasan yuridis adalah landasan yang bersasarkan undang – undang dan peraturan pemerintah,atau PP.'
          },
          {
            id: 24,
            title: 'Komponen Inti',
            content: 'Kompetensi inti kompetensi inti dirancang seiring dengan meningkatnya usia peserta didik pada kelas tertentu. Melalui kompetensi inti, integrasi vertikal berbagai kompetensi dasar pada kelas yang berbeda dapat dijaga.'
          },
          {
            id: 25,
            title: 'Mata Pelajaran Kurikulum',
            content: 'Berdasarkan kurikulum ini disusun matapelajaran dan alokasi waktu yang sesuai dengan karakteristik satuan pendidikan.'
          },
          {
            id: 26,
            title: 'Beban Belajar Kurikulum 2013',
            content: 'Beban belajar merupakan keseluruhan kegiatan yang harus diikuti peserta didik dalam satu minggu, satu semester dan satu tahun pembelajaran.'
          },
          {
            id: 27,
            title: 'Kompetensi Dasar',
            content: 'Kompetensi dasar dirumuskan untuk mencapai kompetensi inti. Rumusan kompetensi dasar dikembangkan dengan memperhatikan karakteristik peserta didik, kemampuan awal, serta ciri dari suatu mata pelajaran.'
          }
        ]
      },
      {
        id: 3,
        title: 'Muatan Kurikulum',
        content: 'Muatan Kurikulum 2013'
      },
      {
        id: 4,
        title: 'Pelaksanaan Kurikulum',
        content: 'Pelaksanaan kurikulum 2013 pada Sekolah Dasar/Madrasah Ibtidaiyah dilakukan melalui pembelajaran dengan pendekatan tematik-terpadu dari kelas I sampai VI. Matapelajaran Pendidikan Agama dan Budi Pekerti dikecualikan untuk tidak menggunakan pembelajaran tematik-terpadu. Pembelajaran tematik terpadu merupakan pendekatan pembelajaran yang mengintegrasikan berbagai kompetensi dari berbagai matapelajaran ke dalam berbagai tema.'
      }
    ]
  });

  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const handleSave = () => {
    // Add API call to save curriculum data
    setIsEditing(false);
    // This would typically involve an API call to update the data
    alert('Curriculum data saved successfully!');
  };

  const handleUpdateContent = (sectionId, newContent, subsectionId = null) => {
    setCurriculumData(prevData => {
      const newData = { ...prevData };

      if (subsectionId === null) {
        // Update main section
        const sectionIndex = newData.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
          newData.sections[sectionIndex].content = newContent;
        }
      } else {
        // Update subsection
        const sectionIndex = newData.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1 && newData.sections[sectionIndex].subsections) {
          const subsectionIndex = newData.sections[sectionIndex].subsections.findIndex(
            sub => sub.id === subsectionId
          );
          if (subsectionIndex !== -1) {
            newData.sections[sectionIndex].subsections[subsectionIndex].content = newContent;
          }
        }
      }

      return newData;
    });
  };

  const renderContent = (content, sectionId, subsectionId = null) => {
    if (isEditing && isAdmin) {
      return (
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => handleUpdateContent(sectionId, e.target.value, subsectionId)}
          rows={4}
        />
      );
    }
    return <p className="mb-4">{content}</p>;
  };

  const renderSection = (section) => {
    return (
      <div key={section.id} className="mb-4">
        <h5 className="fw-bold">{section.title}</h5>
        {section.content && renderContent(section.content, section.id)}

        {section.subsections && section.subsections.map(subsection => (
          <div key={subsection.id} className="mb-3 ms-4">
            <h6 className="fw-bold">• {subsection.title}</h6>
            {renderContent(subsection.content, section.id, subsection.id)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3">Kurikulum</h2>

          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold">{curriculumData.title}</h4>
                  <p className="text-muted">
                    / Informasi / By {curriculumData.updatedBy} / {curriculumData.lastUpdated}
                  </p>
                </div>

                {isAdmin && (
                  <div>
                    {!isEditing ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={handleSave}
                      >
                        <i className="bi bi-check-lg me-2"></i>Save
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h5 className="fw-bold mb-3">Kurikulum</h5>

              {curriculumData.sections.map(section => renderSection(section))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
