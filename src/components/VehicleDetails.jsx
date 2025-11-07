import React from "react";
import { Image } from "antd";
import { BASE_URL } from "../constant/common";

const VehicleDetails = ({ data }) => {
    if (!data) return null;

    const {
        vehicleNo,
        ownerName,
        address,
        panNo,
        membershipNo,
        registrationDate,
        operator,
        helper,
        drivers,
        photo: vehiclePhoto,
        licensePaper,
        insurancePaper,
        billbookphoto,
        jachPass,
        routePermit
    } = data;

    const formatDate = (date) =>
        date ? date.split("T")[0].split("-").reverse().join("-") : "N/A";

    const BASE_IMAGE_URL = `${BASE_URL}/api/master/fetchimage`;

    const downloadImage = async (filename, customName = null) => {
        if (!filename) return;

        try {
            const url = `${BASE_IMAGE_URL}/${filename}`;
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = customName || filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image.');
        }
    };

    const ImageWithDownload = ({ src, alt, customName, className = "" }) => {
        if (!src) {
            return (
                <div className={`no-image-placeholder ${className}`}>
                    <svg width="64" height="64" fill="#9ca3af" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <span>No Image</span>
                </div>
            );
        }

        return (
            <div className={`image-container ${className}`}>
                <Image
                    width={180}
                    height={180}
                    src={`${BASE_IMAGE_URL}/${src}`}
                    alt={alt}
                    style={{
                        borderRadius: '8px',
                        objectFit: 'contain',
                        border: '1px solid #e5e7eb'
                    }}
                    fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEgMTlWNWMwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yek04LjUgMTMuNWwyLjUgMy4wMUwxNC41IDEybDQuNSA2SDVsMy41LTQuNXoiLz48L3N2Zz4="
                    preview={{
                        mask: <span style={{ color: 'white', fontSize: '12px' }}>Preview</span>
                    }}
                    crossOrigin="anonymous"

                />
                <button
                    className="download-btn"
                    onClick={() => downloadImage(src, customName)}
                    title={`Download ${alt}`}
                >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                </button>
            </div>
        );
    };

    const DocumentCard = ({ title, filename, icon }) => (
        <div className="document-card">
            {filename ? (
                <div className="document-image-container">
                    <Image
                        width={200}
                        height={150}
                        src={`${BASE_IMAGE_URL}/${filename}`}
                        alt={title}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y5ZmFmYiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTQgMkg2Yy0xLjEgMC0yIC45LTIgMnYxNmMwIDEuMS44OSAyIDIgMmgxMmMxLjEgMCAyLS45IDItMlY4bC02LTZ6bTQgMThjMCAuNTUtLjQ1IDEtMSAxSDdjLS41NSAwLTEtLjQ1LTEtMVY0YzAtLjU1LjQ1LTEgMS0xaDZsNCA2djl6Ii8+PC9zdmc+"
                        style={{
                            borderRadius: '6px',
                            objectFit: 'contain',
                            border: '1px solid #e5e7eb'
                        }}
                        preview={{
                            mask: <span style={{ color: 'white', fontSize: '12px' }}>Preview</span>
                        }}
                        crossOrigin="anonymous"
                    />
                    <button
                        className="download-btn document-download"
                        onClick={() => downloadImage(filename, `${title.replace(/\s+/g, '_')}`)}
                        title={`Download ${title}`}
                    >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="document-placeholder">
                    {icon}
                </div>
            )}
            <h4 className="document-title">{title}</h4>
        </div>
    );

    const PersonCard = ({ person, title, index }) => (
        <div className="person-card">
            <div className="person-header">
                <h3 className="person-title">
                    {title} {index ? index : ''}
                </h3>
                {person?.registrationNumber && (
                    <span className="registration-badge">
                        {person.registrationNumber}
                    </span>
                )}
            </div>

            <div className="person-content">
                <div className="person-image">
                    <ImageWithDownload
                        src={person?.photo}
                        alt={`${title} Photo`}
                        customName={`${title}_${person?.operatorName || person?.helperName || person?.driverName || 'photo'}`}
                        className="person-photo"
                    />
                </div>

                <div className="person-details">
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>Name:</label>
                            <span>{person?.operatorName || person?.helperName || person?.driverName || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Address:</label>
                            <span>{person?.address || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Registration No:</label>
                            <span>{person?.registrationNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Pan No:</label>
                            <span>{person?.panNo || 'N/A'}</span>
                        </div>
                        {person?.licenseNo && (
                            <div className="detail-item">
                                <label>License No:</label>
                                <span>{person.licenseNo}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="vehicle-details-container">
            <style jsx>{`
                .vehicle-details-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 24px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: white;
                    color: #1f2937;
                }

                .main-header {
                    text-align: center;
                    margin-bottom: 32px;
                    padding-bottom: 24px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .main-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    color: #1f2937;
                }

                .main-subtitle {
                    font-size: 16px;
                    color: #6b7280;
                    margin: 0;
                }

                .vehicle-main-info {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    gap: 32px;
                    margin-bottom: 40px;
                    align-items: start;
                }

                .vehicle-image-section {
                    text-align: center;
                }

                .vehicle-number {
                    margin-top: 16px;
                    padding: 12px;
                    background: #1f2937;
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                }

                .vehicle-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #f9fafb;
                }

                .info-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }

                .info-value {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2937;
                }

                .section-divider {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 40px 0;
                }

                .section-header {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .documents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .document-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    background: white;
                    transition: all 0.2s ease;
                }

                .document-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .document-image-container {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 12px;
                }

                .document-placeholder {
                    width: 200px;
                    height: 150px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                }

                .document-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin: 0;
                }

                .person-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    background: white;
                }

                .person-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .person-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .registration-badge {
                    background: #10b981;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .person-content {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    gap: 24px;
                    align-items: start;
                }

                .person-image {
                    text-align: center;
                }

                .detail-grid {
                    display: grid;
                    gap: 16px;
                }

                .detail-item {
                    display: grid;
                    grid-template-columns: 140px 1fr;
                    gap: 12px;
                    align-items: center;
                    padding: 12px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border-left: 3px solid #6b7280;
                }

                .detail-item label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-item span {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2937;
                }

                .image-container {
                    position: relative;
                    display: inline-block;
                }

                .no-image-placeholder {
                    width: 180px;
                    height: 180px;
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #9ca3af;
                    font-size: 14px;
                }

                .download-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    opacity: 0;
                }

                .image-container:hover .download-btn,
                .document-image-container:hover .download-btn {
                    opacity: 1;
                }

                .download-btn:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: scale(1.1);
                }

                .document-download {
                    background: rgba(59, 130, 246, 0.9);
                }

                .document-download:hover {
                    background: rgba(59, 130, 246, 1);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .vehicle-main-info,
                    .person-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .vehicle-info-grid {
                        grid-template-columns: 1fr;
                    }

                    .documents-grid {
                        grid-template-columns: 1fr;
                    }

                    .detail-item {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .person-header {
                        flex-direction: column;
                        gap: 12px;
                        text-align: center;
                    }
                }
            `}</style>

            <div className="main-header">
                <h1 className="main-title">Personal  & Vehicle Information</h1>
            </div>

            {/* Vehicle Main Info */}
            <div className="vehicle-main-info">
                <div className="vehicle-image-section">
                    <ImageWithDownload
                        src={vehiclePhoto}
                        alt="Vehicle Photo"
                        customName={`Vehicle_${vehicleNo || 'photo'}`}
                    />
                    {/* <div className="vehicle-number">
                        {vehicleNo || 'Vehicle Number'}
                    </div> */}
                </div>

                <div className="vehicle-info-grid">
                    <div className="info-item">
                        <div className="info-label">Vehicle Number</div>
                        <div className="info-value">{vehicleNo || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Owner Name</div>
                        <div className="info-value">{ownerName || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Address</div>
                        <div className="info-value">{address || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Pan Number</div>
                        <div className="info-value">{panNo || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Membership Number</div>
                        <div className="info-value">{membershipNo || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Registration Date</div>
                        <div className="info-value">{formatDate(registrationDate)}</div>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Documents Section */}
            <div>
                <h2 className="section-header">
                    Documents & Papers
                </h2>
                <div className="documents-grid">
                    <DocumentCard
                        title="License Paper"
                        filename={licensePaper}
                        icon={<svg width="48" height="48" fill="#6366f1" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h6l4 6v9z" /></svg>}
                    />
                    <DocumentCard
                        title="Insurance Paper"
                        filename={insurancePaper}
                        icon={<svg width="48" height="48" fill="#10b981" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,12.3 14.1,13 13.3,13H10.7C9.9,13 9.2,12.3 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V10.8H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z" /></svg>}
                    />
                    <DocumentCard
                        title="Bill Book Photo"
                        filename={billbookphoto}
                        icon={<svg width="48" height="48" fill="#f59e0b" viewBox="0 0 24 24"><path d="M18,22A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18M6,4H18V20H6V4M7,9V7H17V9H7M7,13V11H17V13H7M7,17V15H14V17H7Z" /></svg>}
                    />
                    <DocumentCard
                        title="Jach Pass Photo"
                        filename={jachPass}
                        icon={<svg width="48" height="48" fill="#f59e0b" viewBox="0 0 24 24"><path d="M18,22A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18M6,4H18V20H6V4M7,9V7H17V9H7M7,13V11H17V13H7M7,17V15H14V17H7Z" /></svg>}
                    />
                    <DocumentCard
                        title="Route Permit Photo"
                        filename={routePermit}
                        icon={<svg width="48" height="48" fill="#f59e0b" viewBox="0 0 24 24"><path d="M18,22A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18M6,4H18V20H6V4M7,9V7H17V9H7M7,13V11H17V13H7M7,17V15H14V17H7Z" /></svg>}
                    />
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Personnel Section */}
            <div>
                <h2 className="section-header">
                    Personnel Information
                </h2>

                {/* Operator */}
                {operator && (
                    <PersonCard
                        person={operator}
                        title="Operator"
                    />
                )}

                {/* Helper */}
                {helper && (
                    <PersonCard
                        person={helper}
                        title="Helper"
                    />
                )}

                {/* Drivers */}
                {drivers?.length > 0 && drivers.map((driver, index) => (
                    <PersonCard
                        key={driver.id || index}
                        person={driver}
                        title="Driver"
                        index={index + 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default VehicleDetails;