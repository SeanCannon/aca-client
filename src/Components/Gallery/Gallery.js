/* eslint-disable */
import * as R from 'ramda';

import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import {
  Container,
  Header,
  Segment,
  Grid,
  Image,
  Card,
  Loader
} from 'semantic-ui-react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { shuffleMutate } from '../../utils';
import { Api, ArtSvc } from '../../api';

const Gallery = () => {
  const [isLoading, setIsLoading]               = useState(true);
  const [isLoadingMore, setIsLoadingMore]       = useState(true);
  const [searchParams, setSearchParams]         = useState({});
  const [strategy, setStrategy]                 = useState('met');
  const [galleryItemIds, setGalleryItemIds]     = useState([]);
  const [galleryItems, setGalleryItems]         = useState([]);
  const [galleryItemCount, setGalleryItemCount] = useState(0);
  const [pageNum, setPageNum]                   = useState(0);

  const GALLERY_ITEMS_PER_FETCH = 20;

  const fetchMoreItems = () => {
    const page = pageNum + 1;
    console.log('page = ', page)
    console.log(galleryItemIds.slice(page  * GALLERY_ITEMS_PER_FETCH - GALLERY_ITEMS_PER_FETCH, page * GALLERY_ITEMS_PER_FETCH))
    return Promise.all(galleryItemIds.slice(page  * GALLERY_ITEMS_PER_FETCH - GALLERY_ITEMS_PER_FETCH, page * GALLERY_ITEMS_PER_FETCH).map(id => {
      return ArtSvc.getItemById(Api)({ strategy, id });
    }))
      .then(images => setGalleryItems([ ...galleryItems, ...images]))
      .then(() => setPageNum(page))
      .catch(console.error);
  };

  useEffect(() => {
    setIsLoading(true);
    ArtSvc.search(Api)({ strategy })
      .then(R.tap(console.log))
      .then(({ total, itemIds }) => {
        setGalleryItemCount(total);
        setGalleryItemIds(shuffleMutate(R.uniq(itemIds)));
        setPageNum(0);
      });
  }, [searchParams, strategy]);

  useEffect(() => {
    fetchMoreItems();
  }, [galleryItemIds]);

  return (
    <Segment id="gallery" style={{ padding : '8em 0em' }} vertical>
      <Container>
        <Header as="h3" style={{ fontSize : '2em' }}>
          Gallery
        </Header>
        <InfiniteScroll
          dataLength={galleryItems.length}
          next={fetchMoreItems}
          hasMore={galleryItems.length < galleryItemCount}
          loader={<Loader content='Loading' />}
          endMessage={<h5>End of this gallery</h5>}
        >
          <Grid>
            {
              galleryItems.map(({ id, title, primaryImageSmall }) => (
                <Grid.Column key={id} mobile={16} tablet={8} computer={4}>
                  <Card>
                    <Image
                      src={primaryImageSmall}
                      wrapped
                      size="large"
                    />
                    <Card.Content>
                      <Card.Header>{title}</Card.Header>
                      <Card.Meta>Courtesy of MET</Card.Meta>
                      {/*<Card.Description>*/}
                      {/*Daniel is a comedian living in Nashville.*/}
                      {/*</Card.Description>*/}
                    </Card.Content>
                    {/*<Card.Content extra>*/}
                    {/*<a>*/}
                    {/*<Icon name='user' />*/}
                    {/*10 Friends*/}
                    {/*</a>*/}
                    {/*</Card.Content>*/}
                  </Card>
                </Grid.Column>
              ))
            }
          </Grid>
        </InfiniteScroll>

      </Container>
    </Segment>
  );
};

export default Gallery;
