import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutfits, likeOutfit } from '../../actions/outfit';
import Top3Outfits from './Top3Outfits';
import OutfitGallery from './OutfitGallery';
import SubmitOutfit from './SubmitOutfit';
import { Skeleton, Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function OutfitOfTheWeek() {
  const dispatch = useDispatch();
  const { outfits, loading } = useSelector((state) => state.outfit);
  const user = useSelector((state) => state.auth.authData);

  const [topOutfits, setTopOutfits] = useState([]);
  const [otherOutfits, setOtherOutfits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHoveringPostButton, setIsHoveringPostButton] = useState(false);

  useEffect(() => {
    dispatch(fetchOutfits(1, 24)) // fetch more items to support sorting
  }, [dispatch]);

  useEffect(() => {
    if (outfits.length > 0) {
      const sorted = [...outfits].sort((a, b) => b.likes.length - a.likes.length);
      setTopOutfits(sorted.slice(0, 3));
      setOtherOutfits(sorted.slice(3));
    }
  }, [outfits]);

  const handleLike = (id) => {
    if (!user) return alert('Please login to like an outfit.');
    dispatch(likeOutfit(id, user.result._id));
  };
  
  const handleOpenSubmitModal = () => setIsSubmitModalOpen(true);
  const handleCloseSubmitModal = () => setIsSubmitModalOpen(false);

  if (!loading && outfits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#fff9f5] border border-[#f5e7d8] p-10 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-[#aa5a44] mb-4">👗 Outfit of the Week</h2>
          <p className="text-gray-600 text-lg">No outfits submitted yet. Be the first to add one!</p>
        </div>
        {/* Floating button for no outfits scenario */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 100,
            zIndex: 1000,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenSubmitModal}
            onMouseEnter={() => setIsHoveringPostButton(true)}
            onMouseLeave={() => setIsHoveringPostButton(false)}
            sx={{
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
              width: isHoveringPostButton ? '220px' : '48px',
              height: '48px',
              borderRadius: isHoveringPostButton ? '24px' : '50%',
              padding: isHoveringPostButton ? '6px 16px' : '0 12px',
              minWidth: '48px',
              backgroundColor: '#aa5a44',
              '&:hover': {
                backgroundColor: '#8e4738',
              },
            }}
          >
            <AddIcon />
            <Typography
              variant="button"
              sx={{
                whiteSpace: 'nowrap',
                opacity: isHoveringPostButton ? 1 : 0,
                transition: 'opacity 0.3s linear 0.3s',
                marginLeft: '10px'
              }}
            >
              Post an Outfit
            </Typography>
          </Button>
        </Box>
        <SubmitOutfit isOpen={isSubmitModalOpen} onClose={handleCloseSubmitModal} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-[#faf7f3] border border-[#f0e4d3] rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-[#44403c] mb-6">👑 Outfit of the Week</h2>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <>
            <Top3Outfits topOutfits={topOutfits} user={user} handleLike={handleLike} />
            <OutfitGallery
              outfits={otherOutfits}
              user={user}
              handleLike={handleLike}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
            />
          </>
        )}
      </div>

      {/* The floating button to open the modal */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 28,
          right: 100,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenSubmitModal}
          onMouseEnter={() => setIsHoveringPostButton(true)}
          onMouseLeave={() => setIsHoveringPostButton(false)}
          sx={{
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            width: isHoveringPostButton ? '220px' : '48px',
            height: '48px',
            borderRadius: isHoveringPostButton ? '24px' : '50%',
            padding: isHoveringPostButton ? '6px 16px' : '0 12px',
            minWidth: '48px',
            backgroundColor: '#aa5a44',
            '&:hover': {
              backgroundColor: '#8e4738',
            },
          }}
        >
          <AddIcon />
          <Typography
            variant="button"
            sx={{
              whiteSpace: 'nowrap',
              opacity: isHoveringPostButton ? 1 : 0,
              transition: 'opacity 0.3s linear 0.3s',
              marginLeft: '10px'
            }}
          >
            Post an Outfit
          </Typography>
        </Button>
      </Box>

      {/* The modal component for submitting outfits */}
      <SubmitOutfit isOpen={isSubmitModalOpen} onClose={handleCloseSubmitModal} />
    </div>
  );
}